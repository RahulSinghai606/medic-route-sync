
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

    // Get OpenAI API key from environment variable
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Process audio with OpenAI Whisper API for transcription
    const transcription = await processAudioWithWhisper(audioBase64, openaiApiKey)
    
    // Extract vitals from transcription
    const extractedVitals = extractVitalsFromText(transcription)

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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// Process audio with OpenAI Whisper API
async function processAudioWithWhisper(audioBase64: string, apiKey: string): Promise<string> {
  // Convert base64 to binary
  const binaryAudio = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
  
  // Create form data with audio file
  const formData = new FormData()
  const audioBlob = new Blob([binaryAudio], { type: 'audio/webm' })
  formData.append('file', audioBlob, 'audio.webm')
  formData.append('model', 'whisper-1')
  
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
    throw new Error(`OpenAI API error: ${errorData}`)
  }
  
  const data = await response.json()
  return data.text
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
