
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
  transcription?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { audioBase64, medicalContext } = requestData

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
        // Pass medical context to include in prompt if available
        transcription = await processAudioWithWhisper(audioBase64, openaiApiKey, medicalContext)
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
        transcription = await processAudioWithHuggingFace(audioBase64, huggingFaceApiKey, medicalContext)
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
    
    // Enhanced vital sign extraction with improved regex patterns
    const extractedVitals = extractVitalsFromText(transcription)
    
    // Add transcription to the vitals data
    extractedVitals.transcription = transcription
    
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

// Process audio with OpenAI Whisper API with medical context enhancement
async function processAudioWithWhisper(audioBase64: string, apiKey: string, medicalContext?: any): Promise<string> {
  try {
    // Convert base64 to binary
    const binaryAudio = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
    
    // Create form data with audio file
    const formData = new FormData()
    const audioBlob = new Blob([binaryAudio], { type: 'audio/webm' })
    formData.append('file', audioBlob, 'audio.webm')
    
    // Use different models depending on if we're doing medical transcription
    if (medicalContext && medicalContext.domain === "medical") {
      // Use whisper-1 which has better recognition for medical terms
      formData.append('model', 'whisper-1')
      
      // Add prompt to help with medical terminology recognition
      formData.append('prompt', 'This is a medical dictation with vital signs including heart rate, blood pressure, temperature, SpO2, respiratory rate, GCS, and pain level. Numbers are important. Blood pressure is expressed as systolic over diastolic.')
    } else {
      formData.append('model', 'whisper-1')
    }
    
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

// Process audio with HuggingFace API with medical context enhancement
async function processAudioWithHuggingFace(audioBase64: string, apiKey: string, medicalContext?: any): Promise<string> {
  try {
    // Convert base64 to binary
    const binaryAudio = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
    
    console.log("Sending audio to HuggingFace (size: " + binaryAudio.length + " bytes)")
    
    // Convert to blob for fetch API
    const audioBlob = new Blob([binaryAudio], { type: 'audio/webm' })
    
    // Choose appropriate model based on context
    let modelEndpoint = 'openai/whisper-large-v3';
    
    // If medical context is provided, use a model better for medical terms
    if (medicalContext && medicalContext.domain === "medical") {
      // Still using whisper-large-v3 as it's good for medical terminology too
      modelEndpoint = 'openai/whisper-large-v3';
    }
    
    // Send to HuggingFace Inference API
    const response = await fetch(`https://api-inference.huggingface.co/models/${modelEndpoint}`, {
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
    
    Format your response as follows:
    Clinical Probability: [your assessment]
    Care Recommendations: [your recommendations]
    Specialty Tags: [comma-separated tags]
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
    
    // Try to extract formatted data
    for (const line of lines) {
      if (line.toLowerCase().includes('clinical probability:')) {
        probability = line.split('Clinical Probability:')[1]?.trim() || probability;
      } 
      else if (line.toLowerCase().includes('care recommendations:')) {
        recommendations = line.split('Care Recommendations:')[1]?.trim() || recommendations;
      }
      else if (line.toLowerCase().includes('specialty tags:')) {
        const tagsText = line.split('Specialty Tags:')[1]?.trim();
        if (tagsText) {
          tags = tagsText.split(',').map(t => t.trim()).filter(t => t.length > 0);
        }
      }
    }
    
    // Fallback to basic line parsing if structured extraction failed
    if (probability === "Assessment unavailable" && lines.length >= 1) {
      probability = lines[0];
    }
    if (recommendations === "Please consult with a medical professional" && lines.length >= 2) {
      recommendations = lines[1];
    }
    if (tags.length === 1 && tags[0] === "General" && lines.length >= 3) {
      const potentialTags = lines[2].split(',').map(t => t.trim());
      if (potentialTags.length > 0) {
        tags = potentialTags;
      }
    }

    // Clean up tags - remove hashtags and ensure proper formatting
    tags = tags.map(tag => tag.replace(/^#/, '').trim()).filter(tag => tag.length > 0);
    if (tags.length === 0) {
      tags = ["General"];
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

// Extract vitals from transcription text - improved for medical terminology
function extractVitalsFromText(text: string): VitalsData {
  const vitals: VitalsData = {
    notes: text // Save full transcription as notes
  }
  
  // Improved blood pressure patterns with more medical variations
  const bpPatterns = [
    /(?:BP|blood pressure)[:\s]+(\d+)[\s/]+over[\s/]+(\d+)/i,
    /(?:BP|blood pressure)[:\s]+(\d+)[/](\d+)/i,
    /(?:BP|blood pressure)(?:[:\s]+|[\s]+is[\s]+)(\d+)[\s/](\d+)/i,
    /(?:systolic|systole)[\s:]+(\d+)[\s,]+(?:diastolic|diastole)[\s:]+(\d+)/i,
    /(?:BP|blood pressure)[\s:]*(\d+)[\s/](\d+)[\s]*(?:mm ?Hg|millimeters of mercury)/i,
    /pressure[\s:]*(?:of|is|at)[\s:]*(\d+)[\s/](\d+)/i,
    /(?:systolic|blood[\s:]*pressure[\s:]*top[\s:]*number)[\s:]*(?:of|is|at)[\s:]*(\d+)[\s,]+(?:diastolic|bottom[\s:]*number)[\s:]*(?:of|is|at)[\s:]*(\d+)/i
  ];
  
  for (const pattern of bpPatterns) {
    const match = text.match(pattern);
    if (match) {
      vitals.bp_systolic = parseInt(match[1]);
      vitals.bp_diastolic = parseInt(match[2]);
      break;
    }
  }
  
  // Improved heart rate patterns with medical terminology
  const hrPatterns = [
    /(?:HR|heart rate|pulse|heart)\b[:\s]+(\d+)(?:\s+bpm|\s+beats per minute)?/i,
    /(?:HR|heart rate|pulse|heart)\b(?:[:\s]+|[\s]+is[\s]+|[\s]+at[\s]+)(\d+)(?:\s+bpm|\s+beats per minute)?/i,
    /(?:HR|heart rate|pulse|heart)\b(?:[:\s]+|[\s]+of[\s]+)(\d+)(?:\s+bpm|\s+beats per minute)?/i,
    /(?:HR|heart rate|pulse|heart)\b[\s:]*(\d+)(?:\s+bpm|\s+beats per minute)?/i,
    /(?:pulse|heart|beats)[:\s]*(?:rate|rhythm)?[:\s]*(?:is|of|at)[:\s]*(\d+)/i,
    /(?:cardiac monitor|monitor|rhythm strip) shows[:\s]*(\d+)/i
  ];
  
  for (const pattern of hrPatterns) {
    const match = text.match(pattern);
    if (match) {
      vitals.heart_rate = parseInt(match[1]);
      break;
    }
  }
  
  // Improved SpO2 patterns with variations
  const spo2Patterns = [
    /(?:SpO2|oxygen saturation|o2 sat|oxygen sat|pulse ox|oxygen level|oxygen|sat)[:\s]+(\d+)(?:\s*%|\s+percent)?/i,
    /(?:SpO2|oxygen saturation|o2 sat|oxygen sat|pulse ox|oxygen level|oxygen|sat)(?:[:\s]+|[\s]+is[\s]+|[\s]+of[\s]+|[\s]+at[\s]+)(\d+)(?:\s*%|\s+percent)?/i,
    /(?:SpO2|oxygen saturation|o2 sat|oxygen sat|pulse ox|oxygen level|oxygen|sat)[\s:]*(\d+)(?:\s*%|\s+percent)?/i,
    /(?:oxygen|o2|saturation|pulse ox)[:\s]*(?:level|reading|sat)? is[:\s]*(\d+)(?:\s*%|\s+percent)?/i,
    /(?:oxygen|o2|ox)[\s:]+(?:percentage|level|saturation)[:\s]+(\d+)/i,
    /(?:sats)[:\s]*(?:are|is)[:\s]*(\d+)/i,
    /(?:S|s)[- ]?(?:P|p)[- ]?(?:O|o)[- ]?(?:2|two)[:\s]*(\d+)/i  // Handle S-P-O-2 as spoken
  ];
  
  for (const pattern of spo2Patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      // Validate SpO2 range (typically 70-100%)
      if (value >= 0 && value <= 100) {
        vitals.spo2 = value;
        break;
      }
    }
  }
  
  // Improved temperature patterns for both C and F with spoken variations
  const tempPatterns = [
    /(?:temp|temperature)[:\s]+(\d+\.?\d*)(?:\s*C|\s+celsius)?/i,
    /(?:temp|temperature)[:\s]+(\d+\.?\d*)(?:\s*F|\s+fahrenheit)?/i,
    /(?:temp|temperature)(?:[:\s]+|[\s]+is[\s]+|[\s]+of[\s]+|[\s]+at[\s]+)(\d+\.?\d*)(?:\s*C|\s+celsius)?/i,
    /(?:temp|temperature)(?:[:\s]+|[\s]+is[\s]+|[\s]+of[\s]+|[\s]+at[\s]+)(\d+\.?\d*)(?:\s*F|\s+fahrenheit)?/i,
    /(?:temp|temperature)[:\s]*(\d+\.?\d*)(?:\s*degrees?)?(?:\s*C|\s+celsius)?/i,
    /(?:temp|temperature)[:\s]*(\d+\.?\d*)(?:\s*degrees?)?(?:\s*F|\s+fahrenheit)?/i,
    /(?:patient|oral|rectal|axillary|tympanic)[:\s]*(?:temperature|temp)[:\s]*(\d+\.?\d*)(?:\s*degrees?)?(?:\s*C|\s+celsius)?/i,
    /(?:patient|oral|rectal|axillary|tympanic)[:\s]*(?:temperature|temp)[:\s]*(\d+\.?\d*)(?:\s*degrees?)?(?:\s*F|\s+fahrenheit)?/i,
    /(\d+\.?\d*)(?:\s*degrees?)?(?:\s*C|\s+celsius)/i,
    /(\d+\.?\d*)(?:\s*degrees?)?(?:\s*F|\s+fahrenheit)/i
  ];
  
  for (let i = 0; i < tempPatterns.length; i++) {
    const match = text.match(tempPatterns[i]);
    if (match) {
      const tempValue = parseFloat(match[1]);
      // Even-indexed patterns are for Celsius, odd-indexed for Fahrenheit
      if (i % 2 === 0) {
        // Validate Celsius range (typically 35-42°C for humans)
        if (tempValue >= 30 && tempValue <= 45) {
          vitals.temperature = tempValue;
        }
      } else {
        // Validate Fahrenheit range (typically 95-108°F for humans)
        if (tempValue >= 90 && tempValue <= 110) {
          // Convert Fahrenheit to Celsius
          vitals.temperature = parseFloat(((tempValue - 32) * 5/9).toFixed(1));
        }
      }
      if (vitals.temperature) break;
    }
  }
  
  // Improved respiratory rate patterns with medical variations
  const rrPatterns = [
    /(?:RR|resp rate|respiratory rate|respirations)[:\s]+(\d+)(?:\s+(?:breaths per minute|BPM))?/i,
    /(?:RR|resp rate|respiratory rate|respirations)(?:[:\s]+|[\s]+is[\s]+|[\s]+of[\s]+|[\s]+at[\s]+)(\d+)(?:\s+(?:breaths per minute|BPM))?/i,
    /(?:breathing|respirations)[:\s]+(\d+)(?:\s+(?:breaths per minute|BPM))?/i,
    /(?:respiratory rate|respirations|breathing)[:\s]*(?:is|of|at)[:\s]*(\d+)/i,
    /respirations[\s:]*(\d+)[\s:]*(?:per minute)?/i,
    /(?:breathing|respiratory) rate[\s:]*(?:of|is|at)[\s:]*(\d+)/i,
    /(?:breaths per minute|breathing rate)[\s:]*(\d+)/i
  ];
  
  for (const pattern of rrPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      // Validate RR range (typically 8-40 breaths/min)
      if (value >= 4 && value <= 60) {
        vitals.respiratory_rate = value;
        break;
      }
    }
  }
  
  // Improved GCS patterns with medical variations
  const gcsPatterns = [
    /(?:GCS|glasgow coma scale|glasgow|glasgow scale)[:\s]+(\d+)(?:\/15)?/i,
    /(?:GCS|glasgow coma scale|glasgow|glasgow scale)(?:[:\s]+|[\s]+is[\s]+|[\s]+of[\s]+)(\d+)(?:\/15)?/i,
    /(?:GCS|glasgow coma scale|glasgow|glasgow scale)[:\s]*(?:score|level|value)?[:\s]*(\d+)(?:\/15)?/i,
    /(?:glasgow score|glasgow value|GCS score)[:\s]*(?:is|of|at)[:\s]*(\d+)(?:\/15)?/i,
    /(?:G|g)[- ]?(?:C|c)[- ]?(?:S|s)[:\s]*(\d+)(?:\/15)?/i  // Handle G-C-S as spoken
  ];
  
  for (const pattern of gcsPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      // Validate GCS range (3-15)
      if (value >= 3 && value <= 15) {
        vitals.gcs = value;
        break;
      }
    }
  }
  
  // Improved pain level patterns with medical variations
  const painPatterns = [
    /(?:pain scale|pain level|pain)[:\s]+(\d+)(?:\/10)?/i,
    /(?:pain scale|pain level|pain)(?:[:\s]+|[\s]+is[\s]+|[\s]+of[\s]+|[\s]+at[\s]+)(\d+)(?:\/10)?/i,
    /(?:pain)[:\s]*(?:score|level|intensity|scale)?[:\s]*(\d+)(?:\/10| out of 10)?/i,
    /(?:reports|rates|scores|describes)[\s:]*(?:pain|discomfort)[\s:]*(?:as|of|at)[\s:]*(\d+)(?:\/10| out of 10)?/i,
    /(?:pain)[\s:]+(?:rating|intensity|level)[\s:]+(\d+)/i,
    /(?:rates|scores)[\s:]+(?:pain|discomfort)[\s:]+(?:as|at)[\s:]+(\d+)/i
  ];
  
  for (const pattern of painPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      // Validate pain range (0-10)
      if (value >= 0 && value <= 10) {
        vitals.pain_level = value;
        break;
      }
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

    // Create a more specific prompt to generate accurate clinical assessment
    const prompt = `
    You are an experienced emergency medicine physician assistant. Based on the following patient information, provide:
    
    1. A clinical probability assessment (one clear, concise sentence)
    2. 2-3 specific care recommendations (concise and actionable)
    3. 2-4 appropriate medical specialty tags (format as hashtags)
    
    PATIENT TRANSCRIPTION: "${transcription}"
    
    VITAL SIGNS: ${vitalSigns}
    
    ASSESSMENT GUIDELINES:
    - If vital signs are incomplete, note this in your assessment
    - If vitals show any critical values, prioritize urgent care recommendations
    - Consider the following critical thresholds:
      * Heart rate < 50 or > 120 bpm
      * Systolic BP < 90 or > 180 mmHg
      * SpO2 < 92%
      * Respiratory rate < 8 or > 30/min
      * Temperature < 36°C or > 38.5°C
      * GCS < 13
      * Pain level > 7
    
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
