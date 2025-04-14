
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type VitalsData = {
  heart_rate?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  spo2?: number;
  temperature?: number;
  respiratory_rate?: number;
  gcs?: number;
  pain_level?: number;
  notes?: string;
  ai_assessment?: {
    clinical_probability: string;
    care_recommendations: string;
    specialty_tags: string[];
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { audioBase64 } = requestData

    if (!audioBase64) {
      throw new Error('No audio data provided')
    }

    // Get API keys from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    const huggingFaceApiKey = Deno.env.get('HUGGINGFACE_API_KEY')
    
    if (!openaiApiKey && !huggingFaceApiKey) {
      throw new Error('No API keys configured. Please add either OpenAI or HuggingFace API key.')
    }

    console.log("Starting transcription process...")
    let transcription = '';
    let transcriptionError = null;

    // First try OpenAI if key is available
    if (openaiApiKey) {
      try {
        transcription = await processAudioWithWhisper(audioBase64, openaiApiKey)
        console.log("OpenAI transcription successful:", transcription.substring(0, 50) + "...")
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError)
        transcriptionError = openaiError.message;
        // We'll try HuggingFace as fallback
      }
    }

    // If OpenAI failed or wasn't available, try HuggingFace
    if (!transcription && huggingFaceApiKey) {
      try {
        transcription = await processAudioWithHuggingFace(audioBase64, huggingFaceApiKey)
        console.log("HuggingFace transcription successful:", transcription.substring(0, 50) + "...")
        transcriptionError = null; // Clear error if HuggingFace succeeded
      } catch (hfError) {
        console.error('HuggingFace API error:', hfError)
        // If we already had an OpenAI error, keep that as primary
        if (!transcriptionError) {
          transcriptionError = hfError.message;
        }
      }
    }

    // If both APIs failed, return a useful error message
    if (!transcription) {
      const errorMessage = transcriptionError || 'Failed to transcribe audio with all available services';
      
      // Return basic extraction without transcription
      const basicVitals: VitalsData = {
        notes: `Transcription unavailable - API service error: ${errorMessage}. Please try again later.`,
        ai_assessment: {
          clinical_probability: "Assessment unavailable due to API limitations",
          care_recommendations: "Please consult with a medical professional for proper assessment",
          specialty_tags: ["General"]
        }
      }
      
      return new Response(
        JSON.stringify({
          error: errorMessage,
          vitals: basicVitals
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 even with error to avoid Edge Function error in frontend
        }
      )
    }
    
    // Extract vitals from transcription
    const extractedVitals = extractVitalsFromText(transcription)
    
    console.log("Vitals extracted:", JSON.stringify(extractedVitals))

    // Generate AI clinical assessment
    try {
      let aiAssessment;
      if (openaiApiKey) {
        aiAssessment = await generateClinicalAssessment(transcription, extractedVitals, openaiApiKey)
      } else {
        // Fallback assessment if OpenAI is not available
        aiAssessment = await generateBasicAssessment(transcription, extractedVitals, huggingFaceApiKey as string);
      }
      
      console.log("AI assessment generated:", JSON.stringify(aiAssessment))
      
      // Add AI assessment to vitals data
      extractedVitals.ai_assessment = aiAssessment
    } catch (aiError) {
      console.error('Error generating AI assessment:', aiError)
      // Continue with basic vitals even if AI assessment fails
      extractedVitals.ai_assessment = {
        clinical_probability: "Assessment unavailable - API error",
        care_recommendations: "Please consult with a medical professional",
        specialty_tags: ["General"]
      }
    }

    return new Response(
      JSON.stringify({
        transcription,
        vitals: extractedVitals
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error processing audio:', error)
    // Always return 200 with error in the body to avoid Edge Function error in frontend
    return new Response(
      JSON.stringify({ 
        error: error.message,
        vitals: {
          notes: `Error: ${error.message}`,
          ai_assessment: {
            clinical_probability: "Assessment unavailable due to error",
            care_recommendations: "Please try again later",
            specialty_tags: ["General"]
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even with error to avoid Edge Function error in frontend
      }
    )
  }
})

// Process audio with OpenAI Whisper API
async function processAudioWithWhisper(audioBase64: string, apiKey: string): Promise<string> {
  try {
    // Convert base64 to binary
    const binaryAudio = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
    
    // Create form data with audio file
    const formData = new FormData()
    const audioBlob = new Blob([binaryAudio], { type: 'audio/webm' })
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')
    
    console.log("Sending audio to OpenAI (size: " + binaryAudio.length + " bytes)")
    
    // Send to OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenAI API error response:", errorData)
      
      // Check for quota exceeded error
      if (errorData.includes('insufficient_quota')) {
        throw new Error(`OpenAI API quota exceeded. Please check your billing details.`)
      }
      
      throw new Error(`OpenAI API error: ${errorData}`)
    }
    
    const data = await response.json()
    return data.text
  } catch (error) {
    console.error("Error in processAudioWithWhisper:", error)
    throw error
  }
}

// Process audio with HuggingFace API - improved implementation
async function processAudioWithHuggingFace(audioBase64: string, apiKey: string): Promise<string> {
  try {
    // Convert base64 to binary
    const binaryAudio = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
    
    console.log("Sending audio to HuggingFace (size: " + binaryAudio.length + " bytes)")
    
    // Convert to blob for fetch API
    const audioBlob = new Blob([binaryAudio], { type: 'audio/webm' })
    
    // Send to HuggingFace Inference API - using whisper-large-v3
    const response = await fetch('https://api-inference.huggingface.co/models/openai/whisper-large-v3', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'audio/webm'
      },
      body: audioBlob
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error("HuggingFace API error response:", errorData)
      throw new Error(`HuggingFace API error: ${response.statusText || errorData}`)
    }
    
    const data = await response.json()
    
    // Handle different response formats from Hugging Face
    if (typeof data === 'string') {
      return data;
    } else if (data.text) {
      return data.text;
    } else if (data[0]?.generated_text) {
      return data[0].generated_text;
    } else if (Array.isArray(data) && data.length > 0) {
      return JSON.stringify(data);
    }
    
    throw new Error('Unexpected response format from HuggingFace');
  } catch (error) {
    console.error("Error in processAudioWithHuggingFace:", error)
    throw error
  }
}

// Generate a basic assessment using Hugging Face models when OpenAI is not available
async function generateBasicAssessment(
  transcription: string, 
  vitals: VitalsData,
  apiKey: string
): Promise<{ clinical_probability: string; care_recommendations: string; specialty_tags: string[] }> {
  try {
    // Prepare context from available vitals
    const vitalSigns = [
      vitals.heart_rate ? `Heart Rate: ${vitals.heart_rate} bpm` : null,
      (vitals.bp_systolic && vitals.bp_diastolic) ? `Blood Pressure: ${vitals.bp_systolic}/${vitals.bp_diastolic} mmHg` : null,
      vitals.spo2 ? `SpO2: ${vitals.spo2}%` : null,
      vitals.temperature ? `Temperature: ${vitals.temperature}°C` : null,
      vitals.respiratory_rate ? `Respiratory Rate: ${vitals.respiratory_rate} breaths/min` : null,
      vitals.gcs ? `GCS: ${vitals.gcs}` : null,
      vitals.pain_level ? `Pain Level: ${vitals.pain_level}/10` : null
    ].filter(Boolean).join(', ');

    const prompt = `
    Patient information:
    Transcription: "${transcription}"
    Vital signs: ${vitalSigns}
    
    Based on this information:
    1. Provide a clinical probability assessment in one sentence
    2. Provide 2-3 care recommendations
    3. List 2-4 appropriate medical specialty tags
    `;

    // Call HuggingFace model to generate assessment
    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-xxl', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`);
    }

    const result = await response.json();
    const generatedText = Array.isArray(result) ? result[0].generated_text : result.generated_text;

    // Process simple text output from model into structured data
    const lines = generatedText.split('\n').filter(line => line.trim().length > 0);
    
    // Extract structured data from the generated text
    let probability = "Assessment unavailable";
    let recommendations = "Please consult with a medical professional";
    let tags = ["General"];
    
    if (lines.length >= 1) probability = lines[0];
    if (lines.length >= 2) recommendations = lines[1];
    if (lines.length >= 3) {
      // Parse tags from the third line
      const tagText = lines[2];
      const extractedTags = tagText.match(/#[a-zA-Z0-9]+/g) || 
                          tagText.split(/[\s,]+/).filter(t => t.length > 2);
      
      if (extractedTags && extractedTags.length > 0) {
        tags = extractedTags.map(t => t.startsWith('#') ? t.substring(1) : t);
      }
    }

    return {
      clinical_probability: probability,
      care_recommendations: recommendations,
      specialty_tags: tags
    };
  } catch (error) {
    console.error('Error generating basic assessment with HuggingFace:', error);
    return {
      clinical_probability: "Assessment unavailable using HuggingFace fallback",
      care_recommendations: "Please consult with a medical professional",
      specialty_tags: ["General"]
    };
  }
}

// Extract vitals from transcription text - improved for better accuracy
function extractVitalsFromText(text: string): VitalsData {
  const vitals: VitalsData = {
    notes: text // Save full transcription as notes
  }
  
  // Improved blood pressure patterns with more variations
  const bpPatterns = [
    /(?:BP|blood pressure)[:\s]+(\d+)[\s/]+over[\s/]+(\d+)/i,
    /(?:BP|blood pressure)[:\s]+(\d+)[/](\d+)/i,
    /(?:BP|blood pressure)(?:[:\s]+|[\s]+is[\s]+)(\d+)[\s/](\d+)/i,
    /(?:systolic|systole)[\s:]+(\d+)[\s,]+(?:diastolic|diastole)[\s:]+(\d+)/i
  ];
  
  for (const pattern of bpPatterns) {
    const match = text.match(pattern);
    if (match) {
      vitals.bp_systolic = parseInt(match[1]);
      vitals.bp_diastolic = parseInt(match[2]);
      break;
    }
  }
  
  // Improved heart rate patterns
  const hrPatterns = [
    /(?:HR|heart rate|pulse)[:\s]+(\d+)(?:\s+bpm)?/i,
    /(?:HR|heart rate|pulse)(?:[:\s]+|[\s]+is[\s]+)(\d+)(?:\s+bpm)?/i,
    /(?:HR|heart rate|pulse)(?:[:\s]+|[\s]+of[\s]+)(\d+)(?:\s+bpm)?/i,
    /(?:HR|heart rate|pulse)[\s:]*(\d+)(?:\s+bpm)?/i
  ];
  
  for (const pattern of hrPatterns) {
    const match = text.match(pattern);
    if (match) {
      vitals.heart_rate = parseInt(match[1]);
      break;
    }
  }
  
  // Improved SpO2 patterns
  const spo2Patterns = [
    /(?:SpO2|oxygen saturation|o2 sat)[:\s]+(\d+)(?:\s*%|\s+percent)?/i,
    /(?:SpO2|oxygen saturation|o2 sat)(?:[:\s]+|[\s]+is[\s]+)(\d+)(?:\s*%|\s+percent)?/i,
    /(?:SpO2|oxygen saturation|o2 sat)(?:[:\s]+|[\s]+of[\s]+)(\d+)(?:\s*%|\s+percent)?/i,
    /(?:oxygen|o2)[\s:]+(\d+)(?:\s*%|\s+percent)?/i
  ];
  
  for (const pattern of spo2Patterns) {
    const match = text.match(pattern);
    if (match) {
      vitals.spo2 = parseInt(match[1]);
      break;
    }
  }
  
  // Improved temperature patterns for both C and F
  const tempPatterns = [
    /(?:temp|temperature)[:\s]+(\d+\.?\d*)(?:\s*C|\s+celsius)?/i,
    /(?:temp|temperature)[:\s]+(\d+\.?\d*)(?:\s*F|\s+fahrenheit)?/i,
    /(?:temp|temperature)(?:[:\s]+|[\s]+is[\s]+)(\d+\.?\d*)(?:\s*C|\s+celsius)?/i,
    /(?:temp|temperature)(?:[:\s]+|[\s]+is[\s]+)(\d+\.?\d*)(?:\s*F|\s+fahrenheit)?/i,
    /(?:temp|temperature)(?:[:\s]+|[\s]+of[\s]+)(\d+\.?\d*)(?:\s*C|\s+celsius)?/i,
    /(?:temp|temperature)(?:[:\s]+|[\s]+of[\s]+)(\d+\.?\d*)(?:\s*F|\s+fahrenheit)?/i
  ];
  
  for (let i = 0; i < tempPatterns.length; i++) {
    const match = text.match(tempPatterns[i]);
    if (match) {
      const tempValue = parseFloat(match[1]);
      // Even-indexed patterns are for Celsius, odd-indexed for Fahrenheit
      if (i % 2 === 0) {
        vitals.temperature = tempValue;
      } else {
        // Convert Fahrenheit to Celsius
        vitals.temperature = parseFloat(((tempValue - 32) * 5/9).toFixed(1));
      }
      break;
    }
  }
  
  // Improved respiratory rate patterns
  const rrPatterns = [
    /(?:RR|resp rate|respiratory rate)[:\s]+(\d+)/i,
    /(?:RR|resp rate|respiratory rate)(?:[:\s]+|[\s]+is[\s]+)(\d+)/i,
    /(?:RR|resp rate|respiratory rate)(?:[:\s]+|[\s]+of[\s]+)(\d+)/i,
    /(?:breathing|respirations)[\s:]+(\d+)/i
  ];
  
  for (const pattern of rrPatterns) {
    const match = text.match(pattern);
    if (match) {
      vitals.respiratory_rate = parseInt(match[1]);
      break;
    }
  }
  
  // Improved GCS patterns
  const gcsPatterns = [
    /(?:GCS|glasgow coma scale)[:\s]+(\d+)/i,
    /(?:GCS|glasgow coma scale)(?:[:\s]+|[\s]+is[\s]+)(\d+)/i,
    /(?:GCS|glasgow coma scale)(?:[:\s]+|[\s]+of[\s]+)(\d+)/i,
    /(?:glasgow)[\s:]+(\d+)/i
  ];
  
  for (const pattern of gcsPatterns) {
    const match = text.match(pattern);
    if (match) {
      vitals.gcs = parseInt(match[1]);
      break;
    }
  }
  
  // Improved pain level patterns
  const painPatterns = [
    /(?:pain scale|pain level|pain)[:\s]+(\d+)(?:\/10)?/i,
    /(?:pain scale|pain level|pain)(?:[:\s]+|[\s]+is[\s]+)(\d+)(?:\/10)?/i,
    /(?:pain scale|pain level|pain)(?:[:\s]+|[\s]+of[\s]+)(\d+)(?:\/10)?/i,
    /(?:pain)[\s:]+(\d+)(?:\/10)?/i
  ];
  
  for (const pattern of painPatterns) {
    const match = text.match(pattern);
    if (match) {
      vitals.pain_level = parseInt(match[1]);
      break;
    }
  }
  
  return vitals;
}

// Generate AI clinical assessment using OpenAI
async function generateClinicalAssessment(
  transcription: string, 
  vitals: VitalsData, 
  apiKey: string
): Promise<{ clinical_probability: string; care_recommendations: string; specialty_tags: string[] }> {
  try {
    // Prepare the prompt with all available vital information
    const vitalSigns = [
      vitals.heart_rate ? `Heart Rate: ${vitals.heart_rate} bpm` : null,
      (vitals.bp_systolic && vitals.bp_diastolic) ? `Blood Pressure: ${vitals.bp_systolic}/${vitals.bp_diastolic} mmHg` : null,
      vitals.spo2 ? `SpO2: ${vitals.spo2}%` : null,
      vitals.temperature ? `Temperature: ${vitals.temperature}°C` : null,
      vitals.respiratory_rate ? `Respiratory Rate: ${vitals.respiratory_rate} breaths/min` : null,
      vitals.gcs ? `GCS: ${vitals.gcs}` : null,
      vitals.pain_level ? `Pain Level: ${vitals.pain_level}/10` : null
    ].filter(Boolean).join(', ');

    const prompt = `
    Based on the following patient information, provide:
    1. A clinical probability assessment (one sentence)
    2. 2-3 specific care recommendations
    3. 2-4 appropriate medical specialty tags (format as hashtags)
    
    PATIENT TRANSCRIPTION: "${transcription}"
    
    VITAL SIGNS: ${vitalSigns}
    
    Format your response exactly as follows, with each section on a new line:
    Clinical Probability: [your assessment]
    Care Recommendations: [your recommendations]
    Specialty Tags: #Tag1 #Tag2 #Tag3
    `;

    console.log("Sending AI assessment request to OpenAI...")

    // Call OpenAI API for clinical assessment
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            "role": "system",
            "content": "You are an experienced emergency medicine AI assistant. Provide concise, accurate clinical assessments based on patient information."
          },
          {
            "role": "user",
            "content": prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error response:", errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    console.log("AI response:", aiResponse);
    
    // Parse the AI response to extract the requested information
    const clinicalProbabilityMatch = aiResponse.match(/Clinical Probability:\s*(.*?)(?:\n|$)/);
    const careRecommendationsMatch = aiResponse.match(/Care Recommendations:\s*(.*?)(?:\n|$)/);
    const specialtyTagsMatch = aiResponse.match(/Specialty Tags:\s*(.*?)(?:\n|$)/);
    
    // Extract tags as an array
    const specialtyTagsString = specialtyTagsMatch?.[1] || "";
    const specialtyTags = specialtyTagsString
      .match(/#[a-zA-Z0-9]+/g)
      ?.map(tag => tag.substring(1)) || [];
    
    return {
      clinical_probability: clinicalProbabilityMatch?.[1] || "Assessment unavailable",
      care_recommendations: careRecommendationsMatch?.[1] || "Recommendations unavailable",
      specialty_tags: specialtyTags.length > 0 ? specialtyTags : ["General"]
    };
  } catch (error) {
    console.error('Error generating clinical assessment:', error);
    return {
      clinical_probability: "Unable to generate clinical assessment",
      care_recommendations: "Please consult with a medical professional",
      specialty_tags: ["General"]
    };
  }
}
