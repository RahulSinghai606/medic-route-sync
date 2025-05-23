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

    console.log("Starting enhanced medical transcription process...")
    let transcription = '';
    let transcriptionError = null;

    // First try OpenAI with enhanced medical context
    if (openaiApiKey) {
      try {
        transcription = await processAudioWithWhisper(audioBase64, openaiApiKey, medicalContext)
        console.log("OpenAI transcription successful:", transcription.substring(0, 50) + "...")
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError)
        transcriptionError = openaiError.message;
      }
    }

    // Fallback to HuggingFace if OpenAI failed
    if (!transcription && huggingFaceApiKey) {
      try {
        transcription = await processAudioWithHuggingFace(audioBase64, huggingFaceApiKey, medicalContext)
        console.log("HuggingFace transcription successful:", transcription.substring(0, 50) + "...")
        transcriptionError = null;
      } catch (hfError) {
        console.error('HuggingFace API error:', hfError)
        if (!transcriptionError) {
          transcriptionError = hfError.message;
        }
      }
    }

    // If both APIs failed, return basic vitals with error
    if (!transcription) {
      const errorMessage = transcriptionError || 'Failed to transcribe audio with all available services';
      
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
          status: 200
        }
      )
    }
    
    // Enhanced vital signs extraction with multi-language support
    const extractedVitals = extractVitalsFromText(transcription, medicalContext)
    extractedVitals.transcription = transcription
    
    console.log("Enhanced vitals extracted:", JSON.stringify(extractedVitals))

    // Generate enhanced AI clinical assessment
    try {
      let aiAssessment;
      if (openaiApiKey) {
        aiAssessment = await generateEnhancedClinicalAssessment(transcription, extractedVitals, openaiApiKey, medicalContext)
      } else {
        aiAssessment = await generateBasicAssessment(transcription, extractedVitals, huggingFaceApiKey as string);
      }
      
      console.log("Enhanced AI assessment generated:", JSON.stringify(aiAssessment))
      extractedVitals.ai_assessment = aiAssessment
    } catch (aiError) {
      console.error('Error generating AI assessment:', aiError)
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
        status: 200
      }
    )
  }
})

// Enhanced OpenAI Whisper processing with specialized medical prompts
async function processAudioWithWhisper(audioBase64: string, apiKey: string, medicalContext?: any): Promise<string> {
  try {
    const binaryAudio = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
    
    const formData = new FormData()
    const audioBlob = new Blob([binaryAudio], { type: 'audio/webm' })
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')
    
    // Enhanced medical prompts based on language
    let medicalPrompt = 'This is a medical emergency report with vital signs including heart rate, blood pressure, temperature, SpO2, respiratory rate, GCS, and pain level. Numbers and medical terminology are critical.';
    
    if (medicalContext && medicalContext.language === 'hi-IN') {
      medicalPrompt = 'यह एक आपातकालीन चिकित्सा रिपोर्ट है जिसमें हृदय गति, रक्तचाप, तापमान, SpO2, श्वसन दर, GCS और दर्द का स्तर शामिल है। संख्याएं और चिकित्सा शब्दावली महत्वपूर्ण हैं।';
    } else if (medicalContext && medicalContext.language === 'kn-IN') {
      medicalPrompt = 'ಇದು ಹೃದಯ ಬಡಿತ, ರಕ್ತದೊತ್ತಡ, ಉಷ್ಣಾಂಶ, SpO2, ಉಸಿರಾಟದ ದರ, GCS ಮತ್ತು ನೋವಿನ ಮಟ್ಟವನ್ನು ಒಳಗೊಂಡ ತುರ್ತು ವೈದ್ಯಕೀಯ ವರದಿಯಾಗಿದೆ। ಸಂಖ್ಯೆಗಳು ಮತ್ತು ವೈದ್ಯಕೀಯ ಪರಿಭಾಷೆ ನಿರ್ಣಾಯಕವಾಗಿದೆ।';
    }
    
    formData.append('prompt', medicalPrompt)
    formData.append('language', medicalContext?.language?.split('-')[0] || 'en')
    
    console.log("Sending enhanced medical audio to OpenAI (size: " + binaryAudio.length + " bytes)")
    
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
      
      if (errorData.includes('insufficient_quota')) {
        throw new Error(`OpenAI API quota exceeded. Please check your billing details.`)
      }
      
      throw new Error(`OpenAI API error: ${errorData}`)
    }
    
    const data = await response.json()
    return data.text
  } catch (error) {
    console.error("Error in enhanced processAudioWithWhisper:", error)
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

// Enhanced AI clinical assessment with multi-language support
async function generateEnhancedClinicalAssessment(
  transcription: string, 
  vitals: VitalsData, 
  apiKey: string,
  medicalContext?: any
): Promise<{ clinical_probability: string; care_recommendations: string; specialty_tags: string[] }> {
  try {
    const vitalSigns = [
      vitals.heart_rate ? `Heart Rate: ${vitals.heart_rate} bpm` : null,
      (vitals.bp_systolic && vitals.bp_diastolic) ? `Blood Pressure: ${vitals.bp_systolic}/${vitals.bp_diastolic} mmHg` : null,
      vitals.spo2 ? `SpO2: ${vitals.spo2}%` : null,
      vitals.temperature ? `Temperature: ${vitals.temperature}°C` : null,
      vitals.respiratory_rate ? `Respiratory Rate: ${vitals.respiratory_rate} breaths/min` : null,
      vitals.gcs ? `GCS: ${vitals.gcs}` : null,
      vitals.pain_level ? `Pain Level: ${vitals.pain_level}/10` : null
    ].filter(Boolean).join(', ');

    // Enhanced prompt with emergency medicine specialization
    const prompt = `
    You are an experienced emergency medicine physician AI with specialization in critical care and emergency triage. 
    Based on the following patient information, provide a comprehensive clinical assessment:
    
    PATIENT TRANSCRIPTION: "${transcription}"
    VITAL SIGNS: ${vitalSigns}
    LANGUAGE CONTEXT: ${medicalContext?.language || 'en-US'}
    
    CRITICAL ASSESSMENT GUIDELINES:
    - Prioritize life-threatening conditions (ABCDE approach)
    - Consider cultural and linguistic context for symptom interpretation
    - Account for language barriers that might affect symptom description
    - If vital signs show critical values, recommend immediate emergency care
    - Consider common emergency conditions in Indian healthcare context
    
    CRITICAL THRESHOLDS TO CONSIDER:
    * Heart rate < 50 or > 120 bpm (consider arrhythmias, shock)
    * Systolic BP < 90 or > 180 mmHg (hypotension/hypertensive crisis)  
    * SpO2 < 92% (respiratory compromise, immediate oxygen needed)
    * Temperature < 36°C or > 38.5°C (hypothermia/hyperthermia)
    * Respiratory rate < 8 or > 30/min (respiratory failure risk)
    * GCS < 13 (altered mental status, neurological emergency)
    * Pain level > 7 (severe pain requiring immediate attention)
    
    EMERGENCY CONDITIONS TO ASSESS:
    - Chest pain (MI, PE, pneumothorax)
    - Breathing difficulties (asthma, COPD exacerbation, pneumonia)
    - Altered consciousness (stroke, hypoglycemia, toxicity)
    - Severe pain (appendicitis, renal colic, trauma)
    - Fever with systemic symptoms (sepsis, meningitis)
    - Snake bites and envenomation (common in rural India)
    
    Format your response exactly as follows:
    Clinical Probability: [Detailed assessment with urgency level and differential diagnosis]
    Care Recommendations: [Specific, actionable recommendations with time-sensitive priorities]
    Specialty Tags: #Emergency #Cardiology #Respiratory #Neurology [relevant specialties]
    `;

    console.log("Sending enhanced AI assessment request to OpenAI...")

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
            "content": "You are an expert emergency medicine physician AI assistant with extensive experience in Indian healthcare settings. You provide accurate, culturally-sensitive clinical assessments with emergency medicine expertise."
          },
          {
            "role": "user",
            "content": prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error response:", errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    console.log("Enhanced AI response:", aiResponse);
    
    // Parse the AI response
    const clinicalProbabilityMatch = aiResponse.match(/Clinical Probability:\s*(.*?)(?:\n|Care Recommendations:)/s);
    const careRecommendationsMatch = aiResponse.match(/Care Recommendations:\s*(.*?)(?:\n|Specialty Tags:)/s);
    const specialtyTagsMatch = aiResponse.match(/Specialty Tags:\s*(.*?)(?:\n|$)/s);
    
    const specialtyTagsString = specialtyTagsMatch?.[1] || "";
    const specialtyTags = specialtyTagsString
      .match(/#[a-zA-Z0-9]+/g)
      ?.map(tag => tag.substring(1)) || [];
    
    return {
      clinical_probability: clinicalProbabilityMatch?.[1]?.trim() || "Assessment requires more information",
      care_recommendations: careRecommendationsMatch?.[1]?.trim() || "Consult with emergency medicine specialist immediately",
      specialty_tags: specialtyTags.length > 0 ? specialtyTags : ["Emergency", "General"]
    };
  } catch (error) {
    console.error('Error generating enhanced clinical assessment:', error);
    return {
      clinical_probability: "Unable to generate clinical assessment - please consult emergency physician immediately",
      care_recommendations: "Seek immediate medical attention at nearest emergency department",
      specialty_tags: ["Emergency", "General"]
    };
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

// Enhanced vital signs extraction with multi-language support
function extractVitalsFromText(text: string, medicalContext?: any): VitalsData {
  const vitals: VitalsData = {
    notes: text
  }
  
  // Language-specific patterns
  const isHindi = medicalContext?.language === 'hi-IN';
  const isKannada = medicalContext?.language === 'kn-IN';
  
  // Enhanced blood pressure patterns with multi-language support
  const bpPatterns = [
    // English patterns
    /(?:BP|blood pressure)[:\s]+(\d+)[\s/]+over[\s/]+(\d+)/i,
    /(?:BP|blood pressure)[:\s]+(\d+)[/](\d+)/i,
    /(?:systolic|systole)[\s:]+(\d+)[\s,]+(?:diastolic|diastole)[\s:]+(\d+)/i,
    
    // Hindi patterns
    /(?:रक्तचाप|BP)[:\s]+(\d+)[/](\d+)/i,
    /(?:सिस्टोलिक|ऊपरी)[:\s]+(\d+)[\s,]+(?:डायस्टोलिक|निचला)[:\s]+(\d+)/i,
    
    // Kannada patterns
    /(?:ರಕ್ತದೊತ್ತಡ|BP)[:\s]+(\d+)[/](\d+)/i,
    /(?:ಸಿಸ್ಟೋಲಿಕ್|ಮೇಲಿನ)[:\s]+(\d+)[\s,]+(?:ಡಯಾಸ್ಟೋಲಿಕ್|ಕೆಳಗಿನ)[:\s]+(\d+)/i
  ];
  
  for (const pattern of bpPatterns) {
    const match = text.match(pattern);
    if (match) {
      vitals.bp_systolic = parseInt(match[1]);
      vitals.bp_diastolic = parseInt(match[2]);
      break;
    }
  }
  
  // Enhanced heart rate patterns with multi-language support
  const hrPatterns = [
    // English patterns
    /(?:HR|heart rate|pulse|heart)\b[:\s]+(\d+)(?:\s+bpm|\s+beats per minute)?/i,
    
    // Hindi patterns
    /(?:हृदय गति|HR|नब्ज|दिल की धड़कन)[:\s]+(\d+)(?:\s+प्रति मिनट)?/i,
    
    // Kannada patterns
    /(?:ಹೃದಯ ಬಡಿತ|HR|ನಾಡಿ)[:\s]+(\d+)(?:\s+ಪ್ರತಿ ನಿಮಿಷ)?/i
  ];
  
  for (const pattern of hrPatterns) {
    const match = text.match(pattern);
    if (match) {
      vitals.heart_rate = parseInt(match[1]);
      break;
    }
  }
  
  // Enhanced SpO2 patterns with multi-language support
  const spo2Patterns = [
    // English patterns
    /(?:SpO2|oxygen saturation|o2 sat|oxygen)[:\s]+(\d+)(?:\s*%|\s+percent)?/i,
    
    // Hindi patterns
    /(?:ऑक्सीजन|SpO2|ऑक्सीजन संतृप्ति)[:\s]+(\d+)(?:\s*%|\s+प्रतिशत)?/i,
    
    // Kannada patterns
    /(?:ಆಮ್ಲಜನಕ|SpO2|ಆಮ್ಲಜನಕ ಸ್ಯಾಚುರೇಶನ್)[:\s]+(\d+)(?:\s*%|\s+ಶೇಕಡಾ)?/i
  ];
  
  for (const pattern of spo2Patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      if (value >= 0 && value <= 100) {
        vitals.spo2 = value;
        break;
      }
    }
  }
  
  // Enhanced temperature patterns with multi-language support
  const tempPatterns = [
    // English patterns
    /(?:temp|temperature)[:\s]+(\d+\.?\d*)(?:\s*degrees?)?(?:\s*C|\s+celsius)?/i,
    /(?:temp|temperature)[:\s]+(\d+\.?\d*)(?:\s*degrees?)?(?:\s*F|\s+fahrenheit)?/i,
    
    // Hindi patterns
    /(?:तापमान|बुखार)[:\s]+(\d+\.?\d*)(?:\s*डिग्री)?(?:\s*सेल्सियस)?/i,
    /(?:तापमान|बुखार)[:\s]+(\d+\.?\d*)(?:\s*डिग्री)?(?:\s*फारेनहाइट)?/i,
    
    // Kannada patterns
    /(?:ಉಷ್ಣಾಂಶ|ಜ್ವರ)[:\s]+(\d+\.?\d*)(?:\s*ಡಿಗ್ರಿ)?(?:\s*ಸೆಲ್ಸಿಯಸ್)?/i,
    /(?:ಉಷ್ಣಾಂಶ|ಜ್ವರ)[:\s]+(\d+\.?\d*)(?:\s*ಡಿಗ್ರಿ)?(?:\s*ಫ್ಯಾರನ್‌ಹೀಟ್)?/i
  ];
  
  for (let i = 0; i < tempPatterns.length; i++) {
    const match = text.match(tempPatterns[i]);
    if (match) {
      const tempValue = parseFloat(match[1]);
      // Check if it's Fahrenheit (odd indices) and convert to Celsius
      if (i % 2 === 1 && tempValue >= 90 && tempValue <= 110) {
        vitals.temperature = parseFloat(((tempValue - 32) * 5/9).toFixed(1));
      } else if (i % 2 === 0 && tempValue >= 30 && tempValue <= 45) {
        vitals.temperature = tempValue;
      }
      if (vitals.temperature) break;
    }
  }
  
  // Enhanced respiratory rate patterns with multi-language support
  const rrPatterns = [
    // English patterns
    /(?:RR|resp rate|respiratory rate|respirations)[:\s]+(\d+)/i,
    
    // Hindi patterns  
    /(?:श्वसन दर|सांस की दर)[:\s]+(\d+)(?:\s+प्रति मिनट)?/i,
    
    // Kannada patterns
    /(?:ಉಸಿರಾಟದ ದರ|ಶ್ವಾಸಕೋಶದ ದರ)[:\s]+(\d+)(?:\s+ಪ್ರತಿ ನಿಮಿಷ)?/i
  ];
  
  for (const pattern of rrPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      if (value >= 4 && value <= 60) {
        vitals.respiratory_rate = value;
        break;
      }
    }
  }
  
  // Enhanced GCS patterns with multi-language support
  const gcsPatterns = [
    // English patterns
    /(?:GCS|glasgow coma scale|glasgow)[:\s]+(\d+)(?:\/15)?/i,
    
    // Hindi patterns
    /(?:GCS|ग्लासगो कोमा स्केल)[:\s]+(\d+)(?:\/15)?/i,
    
    // Kannada patterns
    /(?:GCS|ಗ್ಲಾಸ್ಗೋ ಕೋಮಾ ಸ್ಕೇಲ್)[:\s]+(\d+)(?:\/15)?/i
  ];
  
  for (const pattern of gcsPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      if (value >= 3 && value <= 15) {
        vitals.gcs = value;
        break;
      }
    }
  }
  
  // Enhanced pain level patterns with multi-language support
  const painPatterns = [
    // English patterns
    /(?:pain scale|pain level|pain)[:\s]+(\d+)(?:\/10| out of 10)?/i,
    
    // Hindi patterns
    /(?:दर्द का स्तर|दर्द)[:\s]+(\d+)(?:\/10| में से 10)?/i,
    
    // Kannada patterns
    /(?:ನೋವಿನ ಮಟ್ಟ|ದರ್ದ)[:\s]+(\d+)(?:\/10| ರಲ್ಲಿ 10)?/i
  ];
  
  for (const pattern of painPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      if (value >= 0 && value <= 10) {
        vitals.pain_level = value;
        break;
      }
    }
  }
  
  return vitals;
}
