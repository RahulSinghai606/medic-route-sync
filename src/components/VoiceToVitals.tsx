
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, StopCircle, Play, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processVoiceRecording } from '@/lib/patientUtils';
import AIClinicalAssessment from './AIClinicalAssessment';

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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setProcessingError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks to properly release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start the timer
      const startTime = Date.now() - recordingTime;
      timerRef.current = window.setInterval(() => {
        setRecordingTime(Date.now() - startTime);
      }, 100);
      
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      
      toast({
        title: "Recording started",
        description: "Speak clearly to record the patient's vital signs",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow access to your microphone to use this feature",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast({
        title: "Recording stopped",
        description: "Processing voice data to extract vital signs",
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
    setProcessingError(null);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const { data, error } = await processVoiceRecording(audioBlob);
      
      if (error) {
        throw new Error(error);
      }
      
      if (data && data.ai_assessment) {
        setAiAssessment(data.ai_assessment);
      }
      
      onVitalsExtracted(data);
      
      toast({
        title: "Processing complete",
        description: "Vital signs extracted successfully",
      });
    } catch (error) {
      console.error('Error processing recording:', error);
      setProcessingError(error instanceof Error ? error.message : "Failed to extract vital signs");
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to extract vital signs",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
                <h3 className="text-lg font-medium mb-2">Voice-to-Vitals</h3>
                <p className="text-sm text-muted-foreground mb-4">Record your voice to automatically extract vital signs</p>
                
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
                        <>
                          Extract Vitals
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                {processingError && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800 mb-4 text-left">
                    <p className="text-red-800 dark:text-red-300 text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Error: {processingError}</span>
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">Tips:</p>
                  <ul className="list-disc list-inside text-left text-xs">
                    <li>Speak clearly and at a normal pace</li>
                    <li>Include vital sign values with their names (e.g., "Blood pressure 120 over 80")</li>
                    <li>Mention all available measurements for best results</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <AIClinicalAssessment assessment={aiAssessment || undefined} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceToVitals;
