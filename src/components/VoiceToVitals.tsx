
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, RotateCw, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { processVoiceRecording } from '@/lib/patientUtils';

interface VoiceToVitalsProps {
  onVitalsExtracted: (vitals: any) => void;
}

const VoiceToVitals: React.FC<VoiceToVitalsProps> = ({ onVitalsExtracted }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      // Reset state for a new recording
      setAudioUrl(null);
      
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
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const processRecording = async () => {
    setIsProcessing(true);
    
    try {
      // Create a blob from all the chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Create a URL for the audio blob (for playback)
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Process the recording using our Supabase function
      const result = await processVoiceRecording(audioBlob);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.data) {
        // Call the callback with extracted vitals
        onVitalsExtracted(result.data);
        
        toast({
          title: "Voice Processing Complete",
          description: "Vital signs extracted successfully!",
        });
      }
    } catch (error: any) {
      console.error("Error processing recording:", error);
      toast({
        title: "Processing Error",
        description: error.message || "Failed to process recording. Please try again or enter vitals manually.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const togglePlayback = () => {
    if (!audioUrl) return;
    
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlaying(false);
    }
    
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
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
        
        {audioUrl && !isRecording && !isProcessing && (
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play
              </>
            )}
          </Button>
        )}
      </div>
      
      <div className="bg-muted p-3 rounded-md text-sm">
        <h4 className="font-medium mb-2">Voice Recording Tips:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Clearly state each vital with its value</li>
          <li>Example: "BP 120 over 80, Heart rate 85, SpO2 98%, Temperature 37.2"</li>
          <li>Include notes about the patient's condition</li>
          <li>For pain level, say "pain level 5" (scale 0-10)</li>
          <li>For GCS, say "GCS 15" (scale 3-15)</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceToVitals;
