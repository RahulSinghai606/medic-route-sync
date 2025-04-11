
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface VoiceToVitalsProps {
  onVitalsExtracted: (vitals: any) => void;
}

const VoiceToVitals: React.FC<VoiceToVitalsProps> = ({ onVitalsExtracted }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = processRecording;
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsRecording(false);
    }
  };
  
  const processRecording = async () => {
    setIsProcessing(true);
    
    try {
      // Mock processing for now since we don't have a backend API
      // In a real implementation, this would send the audio to a backend
      // for processing and extract vitals from the audio
      await mockProcessAudio();
      
    } catch (error) {
      console.error("Error processing recording:", error);
      toast({
        title: "Processing Error",
        description: "Failed to process recording. Please try again or enter vitals manually.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // This is a mock function to simulate audio processing
  // In a real implementation, this would send the audio to a backend
  const mockProcessAudio = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted vitals
    const mockVitals = {
      heart_rate: 85,
      bp_systolic: 120,
      bp_diastolic: 80,
      spo2: 98,
      temperature: 37.2,
      respiratory_rate: 16,
      notes: "Patient appears stable, complaining of chest pain radiating to left arm.",
    };
    
    onVitalsExtracted(mockVitals);
    
    toast({
      title: "Voice Processing Complete",
      description: "Vital signs extracted successfully!",
    });
    
    return mockVitals;
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Voice-to-Vitals</h3>
        {recordingTime > 0 && !isRecording && !isProcessing && (
          <Badge variant="outline" className="ml-2">Recording saved: {formatTime(recordingTime)}</Badge>
        )}
      </div>
      
      <div className="flex justify-center gap-2">
        {!isRecording ? (
          <Button 
            variant="default" 
            className="gap-2"
            onClick={startRecording}
            disabled={isProcessing}
          >
            <Mic className="h-4 w-4" />
            {isProcessing ? "Processing..." : "Record Vitals"}
          </Button>
        ) : (
          <Button 
            variant="destructive" 
            className="gap-2"
            onClick={stopRecording}
          >
            <Square className="h-4 w-4" />
            Stop ({formatTime(recordingTime)})
          </Button>
        )}
        
        {isProcessing && (
          <Button disabled variant="outline" className="gap-2">
            <RotateCw className="h-4 w-4 animate-spin" />
            Processing...
          </Button>
        )}
      </div>
      
      <div className="bg-muted p-3 rounded-md text-sm">
        <h4 className="font-medium mb-2">Voice Recording Tips:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Clearly state each vital with its value</li>
          <li>Example: "BP 120 over 80, Heart rate 85, SpO2 98%, Temperature 37.2"</li>
          <li>Include notes about the patient's condition</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceToVitals;
