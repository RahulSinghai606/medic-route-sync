
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
    // In a real implementation, this would send the audio to a backend API
    // for processing and return the extracted vitals
    // For now, we'll just simulate it with a mock response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response
    const extractedVitals = {
      heart_rate: 85,
      bp_systolic: 120,
      bp_diastolic: 80,
      spo2: 98,
      temperature: 37.2,
      respiratory_rate: 16,
      gcs: 15,
      pain_level: 2,
      notes: "Patient appears stable, complaining of chest pain radiating to left arm."
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
