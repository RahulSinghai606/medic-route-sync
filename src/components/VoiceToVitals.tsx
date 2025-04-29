
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, StopCircle, Play, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processVoiceRecording } from "@/lib/patientUtils";
import AIClinicalAssessment from "./AIClinicalAssessment";

interface VoiceToVitalsProps {
  onVitalsExtracted: (vitals: any) => void;
}

const VoiceToVitals: React.FC<VoiceToVitalsProps> = ({ onVitalsExtracted }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [aiAssessment, setAiAssessment] = useState<{
    clinical_probability: string;
    care_recommendations: string;
    specialty_tags: string[];
  } | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isAssessmentLoading, setIsAssessmentLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Clean up all resources on component unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [isRecording]);

  const startTimer = () => {
    if (timerIntervalRef.current) return;
    
    // Reset recording time when starting a new recording
    setRecordingTime(0);
    
    const startTime = Date.now();
    
    timerIntervalRef.current = window.setInterval(() => {
      setRecordingTime(Date.now() - startTime);
    }, 100);
    
    console.log("Timer started");
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
      console.log("Timer stopped at", recordingTime);
    }
  };

  const startRecording = async () => {
    try {
      setProcessingError(null);
      setTranscription(null);
      setAiAssessment(null);
      
      console.log("Requesting audio stream...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Audio stream obtained");

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up event handlers before starting the recorder
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log("Audio chunk added, size:", event.data.size);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("MediaRecorder stopped");
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        console.log("Audio blob created, size:", audioBlob.size);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Stop all tracks to properly release the microphone
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("Audio track stopped");
        });
      };
      
      // Start the recorder
      mediaRecorder.start();
      console.log("MediaRecorder started");
      
      setIsRecording(true);
      setIsPaused(false);

      toast({
        title: "Recording started",
        description: "Speak clearly to record the patient's vital signs",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Microphone access denied",
        description:
          "Please allow access to your microphone to use this feature",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log("Stopping recording...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      toast({
        title: "Recording stopped",
        description: "Ready to process voice data",
      });
    }
  };

  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) {
      toast({
        title: "No recording available",
        description: "Please record your voice first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setIsAssessmentLoading(true);
    setProcessingError(null);

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      
      console.log("Processing audio blob, size:", audioBlob.size);

      // Add medical context to improve recognition
      const enhancedMedicalContext = addMedicalContextToAudio();
      console.log("Enhanced with medical context:", enhancedMedicalContext ? "Yes" : "No");
      
      const { data, error } = await processVoiceRecording(audioBlob, enhancedMedicalContext);

      if (error) {
        console.warn("Processing warning:", error);
        
        // Show warning toast but don't block the process if we have fallback data
        if (data) {
          toast({
            title: "Processing Warning",
            description: "Using fallback processing due to API limits. Results may be less accurate.",
            variant: "default",
          });
        } else {
          // If we have no data at all, it's a true error
          throw new Error(error);
        }
      }

      if (data) {
        // Set transcription if available
        if (data.transcription) {
          setTranscription(data.transcription);
        }

        // Set AI assessment if available
        if (data.ai_assessment) {
          setAiAssessment(data.ai_assessment);
        }

        // Pass data to parent component
        onVitalsExtracted(data);

        toast({
          title: "Processing complete",
          description: data.transcription ? "Voice data processed successfully" : "Voice processed with limited results",
        });
      } else {
        throw new Error("No data returned from processing");
      }
    } catch (error) {
      console.error("Error processing recording:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to extract vital signs";
      
      setProcessingError(errorMessage);
      
      // Try local fallback processing if API fails completely
      const fallbackData = fallbackExtractVitals();
      if (fallbackData) {
        onVitalsExtracted(fallbackData);
        setAiAssessment(fallbackData.ai_assessment);
      }
      
      toast({
        title: "Processing failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsAssessmentLoading(false);
    }
  };

  // Add medical context to improve the accuracy of transcription
  const addMedicalContextToAudio = () => {
    // This is a client-side function that doesn't modify the audio
    // but sends additional context to the processing function
    return {
      domain: "medical",
      expectedTerms: [
        "blood pressure", "BP", "heart rate", "pulse", "temperature",
        "respiration", "respiratory rate", "oxygen saturation", "SpO2",
        "Glasgow Coma Scale", "GCS", "pain level", "systolic", "diastolic",
        "mmHg", "bpm", "celsius", "fahrenheit", "breaths per minute"
      ],
      prioritizeNumbers: true,
      vitalsFormat: {
        heartRate: "NUMBER bpm",
        bloodPressure: "NUMBER/NUMBER mmHg",
        temperature: "NUMBER celsius|fahrenheit",
        respiratoryRate: "NUMBER breaths per minute",
        oxygenSaturation: "NUMBER percent",
        painLevel: "NUMBER out of 10",
        gcs: "NUMBER out of 15"
      }
    };
  };

  // Fallback extraction in case the API fails
  const fallbackExtractVitals = () => {
    const currentTime = new Date().toLocaleTimeString();
    
    return {
      notes: `Transcription unavailable at ${currentTime} - Speech processing service unavailable. Please try again later or enter vital signs manually.`,
      ai_assessment: {
        clinical_probability: "Assessment unavailable due to API limitations",
        care_recommendations: "Please enter patient data manually and consult with a medical professional",
        specialty_tags: ["General"],
      },
    };
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
                <h3 className="text-lg font-medium mb-2">Voice-to-Vitals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Record your voice to automatically extract vital signs
                </p>

                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {isRecording ? (
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto flex items-center gap-2"
                      onClick={stopRecording}
                    >
                      <StopCircle className="h-4 w-4" />
                      Stop Recording ({formatTime(recordingTime)})
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full sm:w-auto flex items-center gap-2 bg-medical hover:bg-medical/90"
                      onClick={startRecording}
                      disabled={isProcessing}
                    >
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </Button>
                  )}

                  {audioUrl && !isRecording && (
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto flex items-center gap-2"
                      onClick={playRecording}
                      disabled={isProcessing}
                    >
                      <Play className="h-4 w-4" />
                      Play Recording
                    </Button>
                  )}

                  {audioUrl && !isRecording && (
                    <Button
                      variant="default"
                      className="w-full sm:w-auto flex items-center gap-2"
                      onClick={processRecording}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Extract Vitals</>
                      )}
                    </Button>
                  )}
                </div>

                {processingError && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800 mb-4 text-left">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-600" />
                      <div>
                        <p className="text-red-800 dark:text-red-300 text-sm font-medium">Error: {processingError}</p>
                        <p className="text-red-700 dark:text-red-400 text-xs mt-1">
                          Try entering vital signs manually if this error persists
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {transcription && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 mb-4 text-left">
                    <h4 className="text-sm font-medium mb-1">Transcription:</h4>
                    <p className="text-xs text-gray-700 dark:text-gray-300">{transcription}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">Tips:</p>
                  <ul className="list-disc list-inside text-left text-xs">
                    <li>Speak clearly and at a normal pace</li>
                    <li>
                      Include vital sign values with their names (e.g., "Blood
                      pressure 120 over 80")
                    </li>
                    <li>Use medical terminology for better recognition</li>
                    <li>Mention measurements with their units (e.g., "38 degrees celsius")</li>
                    <li>Say "SpO2" as "S-P-O-2" or "oxygen saturation" for better recognition</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full">
              <AIClinicalAssessment 
                assessment={aiAssessment || undefined} 
                isLoading={isAssessmentLoading} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceToVitals;
