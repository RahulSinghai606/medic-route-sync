import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { calculateHospitalMatch } from "@/utils/hospitalUtils";

// Function to save patient information
export const savePatientInfo = async (patientData: any) => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('You must be logged in to save patient data');

    const { data, error } = await supabase
      .from('patients')
      .insert({
        ...patientData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error saving patient:', error);
    return { data: null, error: error.message };
  }
};

// Function to save vital signs
export const saveVitals = async (vitalsData: any, patientId: string) => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('You must be logged in to save vitals');

    const { data, error } = await supabase
      .from('vitals')
      .insert({
        ...vitalsData,
        patient_id: patientId,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error saving vitals:', error);
    return { data: null, error: error.message };
  }
};

// Function to save incident details
export const saveIncident = async (incidentData: any, patientId: string) => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('You must be logged in to save incident details');

    const { data, error } = await supabase
      .from('incidents')
      .insert({
        ...incidentData,
        patient_id: patientId,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error saving incident:', error);
    return { data: null, error: error.message };
  }
};

// Function to save medical history
export const saveMedicalHistory = async (historyData: any, patientId: string) => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('You must be logged in to save medical history');

    const { data, error } = await supabase
      .from('medical_history')
      .insert({
        ...historyData,
        patient_id: patientId,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error saving medical history:', error);
    return { data: null, error: error.message };
  }
};

// Function to fetch all patients
export const fetchPatients = async () => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        vitals(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    return { data: null, error: error.message };
  }
};

// Function to fetch a single patient with all related data
export const fetchPatientDetails = async (patientId: string) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        vitals(*),
        incidents(*),
        medical_history(*)
      `)
      .eq('id', patientId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error fetching patient details:', error);
    return { data: null, error: error.message };
  }
};

// Function to process voice recording and extract vitals
export const processVoiceRecording = async (audioBlob: Blob, medicalContext?: any) => {
  try {
    // 1. Check if audio blob is valid
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('Invalid audio recording. Please try again.');
    }

    console.log('Processing audio recording of size:', audioBlob.size, 'bytes');
    console.log('Medical context provided:', medicalContext ? 'Yes' : 'No');

    // 2. Convert audio blob to base64
    const reader = new FileReader();
    const audioBase64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        try {
          const base64data = reader.result as string;
          // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
          const base64Content = base64data.split(',')[1];
          resolve(base64Content);
        } catch (err) {
          reject(new Error('Failed to convert audio to base64'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read audio file'));
      };
    });
    
    reader.readAsDataURL(audioBlob);
    const audioBase64 = await audioBase64Promise;
    console.log('Successfully converted audio to base64');

    // 3. Call our edge function to process the audio with retry mechanism
    let attempts = 0;
    const maxAttempts = 2;
    let lastError = null;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Processing attempt ${attempts}/${maxAttempts}`);
      
      try {
        const { data: processingResult, error: processingError } = await supabase
          .functions
          .invoke('process-voice-recording', {
            body: { 
              audioBase64,
              // Include medical context if provided
              medicalContext: medicalContext || null 
            }
          });

        if (processingError) {
          console.error('Error invoking edge function:', processingError);
          throw new Error(processingError.message);
        }
        
        // Edge function now always returns 200 status, but may contain error info in the body
        if (processingResult.error) {
          console.warn('Edge function returned an error in response body:', processingResult.error);
          
          // Check if there's still usable data despite the error
          if (processingResult.vitals) {
            return { data: processingResult.vitals, error: processingResult.error };
          }
          
          // If no vitals were extracted, try again if we have attempts left
          lastError = processingResult.error;
          if (attempts < maxAttempts) {
            console.log('Retrying due to error:', lastError);
            continue;
          }
          
          throw new Error(processingResult.error);
        }
        
        if (!processingResult) throw new Error('No data returned from processing');

        // 4. Upload the original audio to Supabase Storage
        try {
          const timestamp = new Date().getTime();
          const filePath = `${timestamp}-recording.webm`;
          
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('audio-recordings')
            .upload(filePath, audioBlob);
          
          if (uploadError) {
            console.warn('Error uploading audio recording:', uploadError);
            // Continue even if upload fails
          } else {
            // Get the public URL for the uploaded audio
            const { data: { publicUrl } } = supabase
              .storage
              .from('audio-recordings')
              .getPublicUrl(filePath);
              
            // Add the URL to the extracted vitals
            processingResult.vitals.audio_url = publicUrl;
          }
        } catch (storageError) {
          console.warn('Error with storage operations:', storageError);
          // Continue even if storage operations fail
        }

        // 5. Return the extracted vitals with transcription
        const extractedVitals = {
          ...processingResult.vitals,
          transcription: processingResult.transcription
        };
        
        return { data: extractedVitals, error: null };
      } catch (error: any) {
        console.error(`Error on attempt ${attempts}:`, error);
        lastError = error.message;
        
        // Only continue to next attempt if we haven't reached max attempts
        if (attempts >= maxAttempts) {
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // If we got here, all attempts failed
    console.error('All processing attempts failed:', lastError);
    
    // Use fallback processing with minimal extracted information
    const fallbackData = {
      notes: `Automatic extraction failed after ${maxAttempts} attempts. Error: ${lastError}`,
      ai_assessment: {
        clinical_probability: "Use caution: AI assessment unavailable due to processing error",
        care_recommendations: "Please enter patient data manually or try again with a shorter, clearer recording",
        specialty_tags: ["General"]
      }
    };
    
    return { 
      data: fallbackData, 
      error: `Processing failed after ${maxAttempts} attempts: ${lastError}`
    };
  } catch (error: any) {
    console.error('Fatal error processing voice recording:', error);
    // Return a more informative error to help with debugging
    return { 
      data: {
        notes: `Error processing voice recording: ${error.message}`,
        ai_assessment: {
          clinical_probability: "Assessment unavailable due to processing error",
          care_recommendations: "Please try again with a shorter recording or record manually",
          specialty_tags: ["General"]
        }
      }, 
      error: error.message 
    };
  }
};

// Hook for displaying toast notifications after save operations
export const usePatientOperations = () => {
  const { toast } = useToast();

  const handleSaveResult = (result: { data: any, error: string | null }, successMessage: string) => {
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      return false;
    } else {
      toast({
        title: "Success",
        description: successMessage,
      });
      return true;
    }
  };

  return { handleSaveResult };
};

// Function to match hospitals based on patient needs and AI assessment
type Hospital = {
  id: number;
  name: string;
  distance: number;
  eta: number;
  specialties: string[];
  availableBeds: number;
  waitTime: number;
  address: string;
  phone: string;
  matchScore: number;
};

export const matchHospitalsToPatient = (
  hospitals: Hospital[],
  vitals: any,
  aiAssessment?: { clinical_probability: string; care_recommendations: string; specialty_tags: string[] }
): Hospital[] => {
  if (!hospitals || !hospitals.length) return [];
  
  // Deep clone the hospitals array to avoid mutating the original
  const rankedHospitals = JSON.parse(JSON.stringify(hospitals)) as Hospital[];
  
  // Base case - no AI assessment or vitals
  if (!vitals && !aiAssessment) return rankedHospitals;
  
  // Determine if this is a critical case based on vital signs
  const isCriticalCase = vitals && (
    (vitals.heart_rate && (vitals.heart_rate > 120 || vitals.heart_rate < 50)) ||
    (vitals.bp_systolic && (vitals.bp_systolic > 180 || vitals.bp_systolic < 90)) ||
    (vitals.spo2 && vitals.spo2 < 92) ||
    (vitals.gcs && vitals.gcs < 9)
  );
  
  // Determine required specialties from AI assessment
  const requiredSpecialties = aiAssessment?.specialty_tags || [];
  
  // Apply hospital matching algorithm to each hospital
  rankedHospitals.forEach(hospital => {
    const matchResult = calculateHospitalMatch(hospital, requiredSpecialties, isCriticalCase);
    hospital.matchScore = matchResult.matchScore;
    
    // Add additional properties to the hospital object
    (hospital as any).matchReason = matchResult.matchReason;
    (hospital as any).promoted = matchResult.promoted;
    
    if (matchResult.matchedSpecialties && matchResult.matchedSpecialties.length > 0) {
      (hospital as any).matchedSpecialties = matchResult.matchedSpecialties;
      (hospital as any).promotedDueToSpecialty = true;
    }
  });
  
  // Sort hospitals by match score (descending)
  return rankedHospitals.sort((a, b) => b.matchScore - a.matchScore);
};
