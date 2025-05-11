
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, StopCircle, Play, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processVoiceRecording } from "@/lib/patientUtils";
import AIClinicalAssessment from "./AIClinicalAssessment";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoiceToVitalsProps {
  onVitalsExtracted: (vitals: any) => void;
}

const VoiceToVitals: React.FC<VoiceToVitalsProps> = ({ onVitalsExtracted }) => {
  const { t, language } = useLanguage();
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
  const [speechLanguage, setSpeechLanguage] = useState<string>(language === 'hi' ? 'hi-IN' : 'en-US');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Update speech language when app language changes
  useEffect(() => {
    if (language === 'hi') {
      setSpeechLanguage('hi-IN');
    } else if (language === 'en') {
      setSpeechLanguage('en-US');
    }
  }, [language]);

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
        title: t('vitals.start'),
        description: t('vitals.description'),
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
        title: t('vitals.stop'),
        description: t('vitals.extract'),
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
    const commonHindiMedicalTerms = [
      "छाती में दर्द", // chest pain
      "दिल का दौरा", // heart attack
      "बुखार", // fever
      "साँस लेने में तकलीफ", // difficulty breathing
      "सिरदर्द", // headache
      "चक्कर आना", // dizziness
      "सांप ने काटा", // snake bite
      "बोल नहीं पा रहा है", // can't speak
      "खून बह रहा है", // bleeding
      "दस्त", // diarrhea
      "उल्टी", // vomiting
      "पेट दर्द", // stomach pain
      "जलना", // burning
      "फ्रैक्चर", // fracture
      "बेहोश", // unconscious
      "मधुमेह", // diabetes
      "रक्तचाप", // blood pressure
      "हृदय गति", // heart rate
    ];

    // Setup context based on selected language
    const medicalContext = {
      domain: "medical",
      language: speechLanguage,
      expectedTerms: speechLanguage === 'hi-IN' ? [
        ...commonHindiMedicalTerms,
        "नब्ज", // pulse
        "ऑक्सीजन", // oxygen
        "ह्रदय गति", // heart rate
        "रक्तचाप", // blood pressure
        "तापमान", // temperature
        "श्वास दर", // respiratory rate
        "जीसीएस", // GCS
        "दर्द स्तर", // pain level
      ] : [
        "blood pressure", "BP", "heart rate", "pulse", "temperature",
        "respiration", "respiratory rate", "oxygen saturation", "SpO2",
        "Glasgow Coma Scale", "GCS", "pain level", "systolic", "diastolic",
        "mmHg", "bpm", "celsius", "fahrenheit", "breaths per minute"
      ],
      prioritizeNumbers: true,
      vitalsFormat: {
        heartRate: speechLanguage === 'hi-IN' ? "NUMBER प्रति मिनट" : "NUMBER bpm",
        bloodPressure: speechLanguage === 'hi-IN' ? "NUMBER/NUMBER mmHg" : "NUMBER/NUMBER mmHg",
        temperature: speechLanguage === 'hi-IN' ? "NUMBER डिग्री" : "NUMBER celsius|fahrenheit",
        respiratoryRate: speechLanguage === 'hi-IN' ? "NUMBER सांस प्रति मिनट" : "NUMBER breaths per minute",
        oxygenSaturation: speechLanguage === 'hi-IN' ? "NUMBER प्रतिशत" : "NUMBER percent",
        painLevel: speechLanguage === 'hi-IN' ? "NUMBER में से" : "NUMBER out of 10",
        gcs: speechLanguage === 'hi-IN' ? "NUMBER में से" : "NUMBER out of 15"
      },
      commonPhrases: speechLanguage === 'hi-IN' ? [
        "मरीज की हालत गंभीर है",
        "मरीज को तुरंत अस्पताल ले जाना चाहिए",
        "मरीज बेहोश है",
        "मरीज को सांस लेने में तकलीफ है"
      ] : [
        "patient is in critical condition",
        "patient needs immediate hospitalization",
        "patient is unconscious",
        "patient has difficulty breathing"
      ]
    };
    
    return medicalContext;
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

  // Language options for speech recognition
  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'hi-IN', label: 'Hindi (भारत)' },
    { value: 'en-IN', label: 'English (India)' }
  ];

  // Examples based on the selected language
  const getExamples = () => {
    if (speechLanguage === 'hi-IN') {
      return [
        "छाती में दर्द (chest pain)",
        "साँस लेने में तकलीफ (difficulty breathing)",
        "सांप ने काटा (snake bite)",
        "बोल नहीं पा रहा है (can't speak)",
        "ह्रदय गति 80 प्रति मिनट (heart rate 80 bpm)"
      ];
    }
    return [
      "Blood pressure 120 over 80",
      "Heart rate 85 beats per minute",
      "Oxygen saturation 95 percent",
      "Temperature 37.5 degrees celsius",
      "GCS score of 15"
    ];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
                <h3 className="text-lg font-medium mb-2">{t('vitals.title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('vitals.description')}
                </p>

                <div className="mb-4">
                  <Select
                    value={speechLanguage}
                    onValueChange={(value) => setSpeechLanguage(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Speech Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {isRecording ? (
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto flex items-center gap-2"
                      onClick={stopRecording}
                    >
                      <StopCircle className="h-4 w-4" />
                      {t('vitals.stop')} ({formatTime(recordingTime)})
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full sm:w-auto flex items-center gap-2 bg-medical hover:bg-medical/90"
                      onClick={startRecording}
                      disabled={isProcessing}
                    >
                      <Mic className="h-4 w-4" />
                      {t('vitals.start')}
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
                      {t('vitals.play')}
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
                          {t('vitals.processing')}
                        </>
                      ) : (
                        <>{t('vitals.extract')}</>
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
                  <p className="mb-1">{t('vitals.tips')}</p>
                  <ul className="list-disc list-inside text-left text-xs">
                    <li>{t('vitals.tip1')}</li>
                    <li>{t('vitals.tip2')}</li>
                    <li>{t('vitals.tip3')}</li>
                    <li>{t('vitals.tip4')}</li>
                    <li>{t('vitals.tip5')}</li>
                  </ul>

                  <div className="mt-3 border-t pt-2">
                    <p className="font-medium mb-1">Example phrases:</p>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md text-left">
                      <ul className="list-disc list-inside">
                        {getExamples().map((example, i) => (
                          <li key={i} className="text-xs">{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
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
