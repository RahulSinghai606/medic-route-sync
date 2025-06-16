
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, StopCircle } from 'lucide-react';

interface AnimatedMicButtonProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  isProcessing: boolean;
  transcription?: string;
  confidence?: number;
  language?: string;
  onLanguageChange?: (language: string) => void;
}

const AnimatedMicButton: React.FC<AnimatedMicButtonProps> = ({
  onStartRecording,
  onStopRecording,
  isRecording,
  isProcessing,
  transcription,
  confidence,
  language = 'en',
  onLanguageChange
}) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [showTranscription, setShowTranscription] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const animationFrame = useRef<number>();

  // Voice commands for different languages
  const voiceCommands = {
    en: ['start recording', 'stop recording', 'emergency', 'hospital', 'patient'],
    hi: ['रिकॉर्डिंग शुरू करें', 'रिकॉर्डिंग बंद करें', 'आपातकाल', 'अस्पताल', 'मरीज'],
    kn: ['ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ', 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ', 'ತುರ್ತು', 'ಆಸ್ಪತ್ರೆ', 'ರೋಗಿ']
  };

  useEffect(() => {
    if (isRecording) {
      startAudioAnalysis();
    } else {
      stopAudioAnalysis();
    }
    
    return () => {
      stopAudioAnalysis();
    };
  }, [isRecording]);

  useEffect(() => {
    if (transcription) {
      setShowTranscription(true);
      const timer = setTimeout(() => {
        setShowTranscription(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [transcription]);

  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      
      analyser.current.fftSize = 256;
      source.connect(analyser.current);
      
      const updateAudioLevel = () => {
        if (analyser.current) {
          const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
          analyser.current.getByteFrequencyData(dataArray);
          
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setAudioLevel(average / 255 * 100);
          
          if (isRecording) {
            animationFrame.current = requestAnimationFrame(updateAudioLevel);
          }
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    if (audioContext.current) {
      audioContext.current.close();
    }
    setAudioLevel(0);
  };

  const getMicButtonClass = () => {
    if (isProcessing) {
      return 'bg-yellow-500 hover:bg-yellow-600 animate-pulse';
    }
    if (isRecording) {
      return 'bg-red-500 hover:bg-red-600 animate-pulse';
    }
    return 'bg-blue-500 hover:bg-blue-600';
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="relative">
      {/* Main Mic Button */}
      <div className="relative">
        <Button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`h-16 w-16 rounded-full ${getMicButtonClass()} text-white shadow-lg transition-all duration-200 hover:scale-105`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Volume2 className="h-8 w-8 animate-bounce" />
          ) : isRecording ? (
            <StopCircle className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        
        {/* Audio Level Visualization */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" 
               style={{ 
                 transform: `scale(${1 + audioLevel / 100})`,
                 opacity: audioLevel / 100 
               }} 
          />
        )}
        
        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute -top-2 -right-2">
            <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mt-2 text-center">
        {isProcessing && (
          <Badge variant="secondary" className="animate-pulse">
            Processing...
          </Badge>
        )}
        {isRecording && (
          <Badge variant="destructive">
            Recording
          </Badge>
        )}
        {!isRecording && !isProcessing && (
          <Badge variant="outline">
            Ready
          </Badge>
        )}
      </div>

      {/* Real-time Transcription Display */}
      {showTranscription && transcription && (
        <Card className="absolute top-20 left-1/2 transform -translate-x-1/2 w-80 p-4 shadow-lg border-2 animate-fade-in z-50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Live Transcription</h4>
              {confidence && (
                <Badge variant="outline" className={getConfidenceColor(confidence)}>
                  {Math.round(confidence * 100)}% confidence
                </Badge>
              )}
            </div>
            <p className="text-sm bg-muted p-2 rounded italic">
              "{transcription}"
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Volume2 className="h-3 w-3" />
              <span>Language: {language.toUpperCase()}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Voice Commands Help */}
      <Card className="absolute top-20 right-0 w-64 p-3 shadow-md opacity-0 hover:opacity-100 transition-opacity duration-300">
        <h5 className="font-medium text-sm mb-2">Voice Commands ({language.toUpperCase()})</h5>
        <div className="space-y-1 text-xs text-muted-foreground">
          {voiceCommands[language as keyof typeof voiceCommands]?.map((command, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className="h-1 w-1 bg-blue-500 rounded-full" />
              <span>"{command}"</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Audio Waveform Visualization */}
      {isRecording && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-red-500 rounded-full transition-all duration-100"
              style={{
                height: `${Math.max(4, (audioLevel / 100) * 20 + Math.random() * 10)}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedMicButton;
