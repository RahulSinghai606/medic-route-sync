import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
export const processVoiceRecording = async (audioBlob: Blob) => {
  try {
    // 1. Convert audio blob to base64
    const reader = new FileReader();
    const audioBase64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
        const base64Content = base64data.split(',')[1];
        resolve(base64Content);
      };
    });
    reader.readAsDataURL(audioBlob);
    const audioBase64 = await audioBase64Promise;

    // 2. Call our edge function to process the audio
    const { data: processingResult, error: processingError } = await supabase
      .functions
      .invoke('process-voice-recording', {
        body: { audioBase64 }
      });

    if (processingError) throw new Error(processingError.message);
    if (!processingResult) throw new Error('No data returned from processing');

    // 3. Upload the original audio to Supabase Storage
    const timestamp = new Date().getTime();
    const filePath = `${timestamp}-recording.webm`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('audio-recordings')
      .upload(filePath, audioBlob);
    
    if (uploadError) throw uploadError;

    // 4. Get the public URL for the uploaded audio
    const { data: { publicUrl } } = supabase
      .storage
      .from('audio-recordings')
      .getPublicUrl(filePath);

    // 5. Combine the extracted vitals with the audio URL, transcription, and AI assessment
    const extractedVitals = {
      ...processingResult.vitals,
      audio_url: publicUrl,
      transcription: processingResult.transcription
    };
    
    return { data: extractedVitals, error: null };
  } catch (error: any) {
    console.error('Error processing voice recording:', error);
    return { data: null, error: error.message };
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
  
  // Calculate match scores with dynamic weighting
  rankedHospitals.forEach(hospital => {
    let proximityScore = 0;
    let specialtyScore = 0;
    let capacityScore = 0;
    
    // Proximity score (0-40) - inversely proportional to distance
    proximityScore = Math.max(0, 40 - (hospital.distance * 8));
    
    // Specialty match score (0-50) - higher for specialty matches
    if (requiredSpecialties.length > 0) {
      const matchedSpecialties = hospital.specialties.filter(spec => {
        // Check if any AI-identified specialty tag is included in this hospital specialty
        return requiredSpecialties.some(tag => {
          const tagLower = tag.toLowerCase();
          const specLower = spec.toLowerCase();
          return specLower.includes(tagLower) || (
            // Handle common synonyms
            (tagLower === 'cardiac' && specLower.includes('heart')) ||
            (tagLower === 'respiratory' && (specLower.includes('pulmonary') || specLower.includes('lung'))) ||
            (tagLower === 'neuro' && specLower.includes('brain')) ||
            (tagLower === 'trauma' && specLower.includes('emergency')) ||
            (tagLower === 'burns' && specLower.includes('burn'))
          );
        });
      });
      
      specialtyScore = Math.min(50, matchedSpecialties.length * 25);
      
      // Boost specialty score for critical cases
      if (isCriticalCase && matchedSpecialties.length > 0) {
        specialtyScore = Math.min(50, specialtyScore * 1.5);
      }
    }
    
    // Capacity score (0-10) - higher for more available beds and lower wait times
    capacityScore = Math.min(10, (hospital.availableBeds * 1.5) - (hospital.waitTime * 0.2));
    
    // Final score calculation with dynamic weighting
    let finalScore = 0;
    
    if (isCriticalCase && specialtyScore > 0) {
      // For critical cases with specialty match, prioritize specialty over proximity
      finalScore = (specialtyScore * 0.6) + (proximityScore * 0.3) + (capacityScore * 0.1);
    } else if (specialtyScore > 0) {
      // For non-critical cases with specialty match, balance specialty and proximity
      finalScore = (specialtyScore * 0.4) + (proximityScore * 0.5) + (capacityScore * 0.1);
    } else {
      // For cases without specialty match, prioritize proximity
      finalScore = (proximityScore * 0.8) + (capacityScore * 0.2);
    }
    
    // Set match score (scale to 0-100)
    hospital.matchScore = Math.round(finalScore);
    
    // Add a flag if this hospital was promoted due to specialty match
    if (specialtyScore > 25) {
      (hospital as any).promotedDueToSpecialty = true;
      (hospital as any).matchedSpecialties = hospital.specialties.filter(spec => 
        requiredSpecialties.some(tag => spec.toLowerCase().includes(tag.toLowerCase()))
      );
    }
  });
  
  // Sort hospitals by match score (descending)
  return rankedHospitals.sort((a, b) => b.matchScore - a.matchScore);
};
