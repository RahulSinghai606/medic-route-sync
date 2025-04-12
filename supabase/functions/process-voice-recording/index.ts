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
    const openaiApiKey = Deno.env.get('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')
    const huggingFaceApiKey = Deno.env.get('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')
    
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
        aiAssessment = {
          clinical_probability: "Assessment unavailable - using transcription only",
          care_recommendations: "Please consult with a medical professional for a complete assessment",
          specialty_tags: ["General"]
        };
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

// Process audio with HuggingFace API
async function processAudioWithHuggingFace(audioBase64: string, apiKey: string): Promise<string> {
  try {
    // Convert base64 to binary
    const binaryAudio = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
    
    console.log("Sending audio to HuggingFace (size: " + binaryAudio.length + " bytes)")
    
    // Convert to blob for fetch API
    const audioBlob = new Blob([binaryAudio], { type: 'audio/webm' })
    
    // Send to HuggingFace Inference API - using automatic-speech-recognition
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
      throw new Error(`HuggingFace API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.text || data[0]?.generated_text || ''
  } catch (error) {
    console.error("Error in processAudioWithHuggingFace:", error)
    throw error
  }
}

// Extract vitals from transcription text
function extractVitalsFromText(text: string): VitalsData {
  const vitals: VitalsData = {
    notes: text // Save full transcription as notes
  }
  
  // Extract blood pressure (e.g., "BP 120 over 80" or "blood pressure 120/80")
  const bpPattern1 = /(?:BP|blood pressure)[:\s]+(\d+)[\s/]+over[\s/]+(\d+)/i
  const bpPattern2 = /(?:BP|blood pressure)[:\s]+(\d+)[/](\d+)/i
  
  const bpMatch = text.match(bpPattern1) || text.match(bpPattern2)
  if (bpMatch) {
    vitals.bp_systolic = parseInt(bpMatch[1])
    vitals.bp_diastolic = parseInt(bpMatch[2])
  }
  
  // Extract heart rate (e.g., "HR 72" or "heart rate 72 bpm")
  const hrPattern = /(?:HR|heart rate|pulse)[:\s]+(\d+)(?:\s+bpm)?/i
  const hrMatch = text.match(hrPattern)
  if (hrMatch) {
    vitals.heart_rate = parseInt(hrMatch[1])
  }
  
  // Extract SpO2 (e.g., "SpO2 98%" or "oxygen saturation 98 percent")
  const spo2Pattern = /(?:SpO2|oxygen saturation|o2 sat)[:\s]+(\d+)(?:\s*%|\s+percent)?/i
  const spo2Match = text.match(spo2Pattern)
  if (spo2Match) {
    vitals.spo2 = parseInt(spo2Match[1])
  }
  
  // Extract temperature (e.g., "Temp 37.2" or "temperature 98.6 F")
  const tempPatternC = /(?:temp|temperature)[:\s]+(\d+\.?\d*)(?:\s*C|\s+celsius)?/i
  const tempPatternF = /(?:temp|temperature)[:\s]+(\d+\.?\d*)(?:\s*F|\s+fahrenheit)?/i
  
  const tempMatchC = text.match(tempPatternC)
  const tempMatchF = text.match(tempPatternF)
  
  if (tempMatchC) {
    vitals.temperature = parseFloat(tempMatchC[1])
  } else if (tempMatchF) {
    // Convert F to C
    const tempF = parseFloat(tempMatchF[1])
    vitals.temperature = parseFloat(((tempF - 32) * 5/9).toFixed(1))
  }
  
  // Extract respiratory rate (e.g., "RR 16" or "respiratory rate 16")
  const rrPattern = /(?:RR|resp rate|respiratory rate)[:\s]+(\d+)/i
  const rrMatch = text.match(rrPattern)
  if (rrMatch) {
    vitals.respiratory_rate = parseInt(rrMatch[1])
  }
  
  // Extract GCS (e.g., "GCS 15" or "Glasgow Coma Scale 15")
  const gcsPattern = /(?:GCS|glasgow coma scale)[:\s]+(\d+)/i
  const gcsMatch = text.match(gcsPattern)
  if (gcsMatch) {
    vitals.gcs = parseInt(gcsMatch[1])
  }
  
  // Extract pain level (e.g., "pain scale 5" or "pain level 5")
  const painPattern = /(?:pain scale|pain level|pain)[:\s]+(\d+)(?:\/10)?/i
  const painMatch = text.match(painPattern)
  if (painMatch) {
    vitals.pain_level = parseInt(painMatch[1])
  }
  
  return vitals
}

// Generate AI clinical assessment
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
