import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { useAuth } from "@/contexts/AuthContext";
import { useHospitals } from "@/hooks/useHospitals";
import { createCase } from "@/hooks/useCases";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Enums } from "@/integrations/supabase/types";

interface VoiceToVitalsProps {
  patientId: string;
  onCaseCreated: (caseId: string) => void;
}

const VoiceToVitals: React.FC<VoiceToVitalsProps> = ({ patientId, onCaseCreated }) => {
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
  const [speechLanguage, setSpeechLanguage] = useState<string>(
    language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US'
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  const { user } = useAuth();
  const { data: hospitals, isLoading: isLoadingHospitals } = useHospitals();
  const [extractedVitals, setExtractedVitals] = useState<any | null>(null);

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [severity, setSeverity] = useState<Enums<'case_severity'>>('Stable');
  const [eta, setEta] = useState<string>('');
  const [paramedicNotes, setParamedicNotes] = useState<string>('');
  
  // Update speech language when app language changes
  useEffect(() => {
    if (language === 'hi') {
      setSpeechLanguage('hi-IN');
    } else if (language === 'kn') {
      setSpeechLanguage('kn-IN');
    } else {
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

  const handleVitalsExtracted = (vitals: any) => {
    setExtractedVitals(vitals);
    if (vitals.transcription) {
      setTranscription(vitals.transcription);
    }
    if (vitals.ai_assessment) {
      setAiAssessment(vitals.ai_assessment);
    }
    if (vitals.notes) {
      setParamedicNotes(prev => prev ? `${prev}\n\n---\nTranscription:\n${vitals.notes}` : `Transcription:\n${vitals.notes}`);
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

      // Enhanced medical context with multi-language support
      const enhancedMedicalContext = addMedicalContextToAudio();
      console.log("Enhanced with medical context:", enhancedMedicalContext ? "Yes" : "No");
      
      const { data, error } = await processVoiceRecording(audioBlob, enhancedMedicalContext);

      if (error) {
        console.warn("Processing warning:", error);
        
        if (data) {
          toast({
            title: "Processing Warning",
            description: "Using fallback processing due to API limits. Results may be less accurate.",
            variant: "default",
          });
        } else {
          throw new Error(error);
        }
      }

      if (data) {
        handleVitalsExtracted(data);

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
      
      const fallbackData = fallbackExtractVitals();
      if (fallbackData) {
        handleVitalsExtracted(fallbackData);
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

  // Enhanced medical context with multi-language support
  const addMedicalContextToAudio = () => {
    const commonHindiMedicalTerms = [
      "छाती में दर्द", "दिल का दौरा", "बुखार", "साँस लेने में तकलीफ", "सिरदर्द", 
      "चक्कर आना", "सांप ने काटा", "बोल नहीं पा रहा है", "खून बह रहा है", "दस्त", 
      "उल्टी", "पेट दर्द", "जलना", "फ्रैक्चर", "बेहोश", "मधुमेह", "रक्तचाप", "हृदय गति",
      "नब्ज", "ऑक्सीजन", "तापमान", "श्वास दर", "जीसीएस", "दर्द स्तर", "रक्त शर्करा",
      "एलर्जी", "अस्थमा", "उच्च रक्तचाप", "निम्न रक्तचाप", "तेज़ हृदय गति", "धीमी हृदय गति"
    ];

    const commonKannadaMedicalTerms = [
      "ಎದೆ ನೋವು", "ಹೃದಯಾಘಾತ", "ಜ್ವರ", "ಉಸಿರಾಟದ ತೊಂದರೆ", "ತಲೆನೋವು", 
      "ತಲೆ ಸುತ್ತುವಿಕೆ", "ಹಾವು ಕಚ್ಚಿದೆ", "ಮಾತನಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ", "ರಕ್ತಸ್ರಾವ", 
      "ಅತಿಸಾರ", "ವಾಂತಿ", "ಹೊಟ್ಟೆ ನೋವು", "ಸುಟ್ಟ", "ಮುರಿತ", "ಪ್ರಜ್ಞೆ ಕಳೆದುಕೊಂಡಿದೆ", 
      "ಮಧುಮೇಹ", "ರಕ್ತದೊತ್ತಡ", "ಹೃದಯ ಬಡಿತ", "ನಾಡಿ", "ಆಮ್ಲಜನಕ", "ಉಷ್ಣಾಂಶ", 
      "ಉಸಿರಾಟದ ದರ", "ದರ್ದದ ಮಟ್ಟ", "ರಕ್ತ ಸಕ್ಕರೆ", "ಅಲರ್ಜಿ", "ಆಸ್ತಮಾ"
    ];

    const medicalContext = {
      domain: "medical_emergency",
      language: speechLanguage,
      specialization: "emergency_healthcare",
      expectedTerms: speechLanguage === 'hi-IN' ? [
        ...commonHindiMedicalTerms,
        "प्रति मिनट", "एमएमएचजी", "डिग्री सेल्सियस", "प्रतिशत", "स्कोर", "स्तर"
      ] : speechLanguage === 'kn-IN' ? [
        ...commonKannadaMedicalTerms,
        "ಪ್ರತಿ ನಿಮಿಷ", "ಎಂಎಂಎಚ್ಜಿ", "ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ", "ಶೇಕಡಾ", "ಸ್ಕೋರ್", "ಮಟ್ಟ"
      ] : [
        "blood pressure", "BP", "heart rate", "pulse", "temperature", "respiration", 
        "respiratory rate", "oxygen saturation", "SpO2", "Glasgow Coma Scale", "GCS", 
        "pain level", "systolic", "diastolic", "mmHg", "bpm", "celsius", "fahrenheit", 
        "breaths per minute", "emergency", "critical", "severe", "unconscious", "bleeding",
        "chest pain", "difficulty breathing", "fever", "headache", "dizziness", "nausea",
        "vomiting", "abdominal pain", "burn", "fracture", "allergy", "asthma", "diabetes"
      ],
      prioritizeNumbers: true,
      contextPrompt: speechLanguage === 'hi-IN' ? 
        "यह एक आपातकालीन चिकित्सा रिपोर्ट है। संख्याओं और चिकित्सा शब्दावली को सटीक रूप से पहचानें।" :
        speechLanguage === 'kn-IN' ?
        "ಇದು ತುರ್ತು ವೈದ್ಯಕೀಯ ವರದಿಯಾಗಿದೆ. ಸಂಖ್ಯೆಗಳು ಮತ್ತು ವೈದ್ಯಕೀಯ ಪರಿಭಾಷೆಯನ್ನು ನಿಖರವಾಗಿ ಗುರುತಿಸಿ." :
        "This is an emergency medical report. Accurately recognize numbers and medical terminology.",
      vitalsFormat: {
        heartRate: speechLanguage === 'hi-IN' ? "NUMBER प्रति मिनट" : 
                  speechLanguage === 'kn-IN' ? "NUMBER ಪ್ರತಿ ನಿಮಿಷ" : "NUMBER bpm",
        bloodPressure: "NUMBER/NUMBER mmHg",
        temperature: speechLanguage === 'hi-IN' ? "NUMBER डिग्री" : 
                    speechLanguage === 'kn-IN' ? "NUMBER ಡಿಗ್ರಿ" : "NUMBER celsius|fahrenheit",
        respiratoryRate: speechLanguage === 'hi-IN' ? "NUMBER सांस प्रति मिनट" : 
                        speechLanguage === 'kn-IN' ? "NUMBER ಉಸಿರಾಟ ಪ್ರತಿ ನಿಮಿಷ" : "NUMBER breaths per minute",
        oxygenSaturation: speechLanguage === 'hi-IN' ? "NUMBER प्रतिशत" : 
                         speechLanguage === 'kn-IN' ? "NUMBER ಶೇಕಡಾ" : "NUMBER percent",
        painLevel: speechLanguage === 'hi-IN' ? "NUMBER में से दस" : 
                  speechLanguage === 'kn-IN' ? "NUMBER ರಲ್ಲಿ ಹತ್ತು" : "NUMBER out of 10",
        gcs: speechLanguage === 'hi-IN' ? "NUMBER में से पंद्रह" : 
             speechLanguage === 'kn-IN' ? "NUMBER ರಲ್ಲಿ ಹದಿನೈದು" : "NUMBER out of 15"
      }
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

  // Enhanced language options with Kannada
  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'hi-IN', label: 'हिंदी (भारत)' },
    { value: 'kn-IN', label: 'ಕನ್ನಡ (ಭಾರತ)' },
    { value: 'en-IN', label: 'English (India)' }
  ];

  // Enhanced examples based on the selected language
  const getExamples = () => {
    if (speechLanguage === 'hi-IN') {
      return [
        "छाती में दर्द और साँस लेने में तकलीफ है",
        "हृदय गति 120 प्रति मिनट है",
        "रक्तचाप 140/90 एमएमएचजी है",
        "बुखार 102 डिग्री फारेनहाइट है",
        "ऑक्सीजन 88 प्रतिशत है",
        "दर्द का स्तर 8 में से 10 है",
        "मरीज बेहोश है, जीसीएस 12 है"
      ];
    } else if (speechLanguage === 'kn-IN') {
      return [
        "ಎದೆ ನೋವು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆ ಇದೆ",
        "ಹೃದಯ ಬಡಿತ 120 ಪ್ರತಿ ನಿಮಿಷ ಇದೆ",
        "ರಕ್ತದೊತ್ತಡ 140/90 ಎಂಎಂಎಚ್ಜಿ ಇದೆ",
        "ಜ್ವರ 102 ಡಿಗ್ರಿ ಫಾರೆನ್‌ಹೀಟ್ ಇದೆ",
        "ಆಮ್ಲಜನಕ 88 ಶೇಕಡಾ ಇದೆ",
        "ನೋವಿನ ಮಟ್ಟ 10 ರಲ್ಲಿ 8 ಇದೆ",
        "ರೋಗಿ ಪ್ರಜ್ಞೆ ಕಳೆದುಕೊಂಡಿದ್ದಾರೆ, ಜಿಸಿಎಸ್ 12 ಇದೆ"
      ];
    }
    return [
      "Blood pressure 120 over 80 mmHg",
      "Heart rate 85 beats per minute",
      "Oxygen saturation 95 percent",
      "Temperature 98.6 degrees fahrenheit",
      "Respiratory rate 16 breaths per minute",
      "Pain level 7 out of 10",
      "GCS score of 15, patient is alert"
    ];
  };

  const createCaseMutation = useMutation({
    mutationFn: createCase,
    onSuccess: (data) => {
        toast({
            title: "Case Created Successfully",
            description: `Case #${data.id.substring(0, 8)} sent to ${hospitals?.find(h => h.id === selectedHospitalId)?.full_name}.`,
        });
        onCaseCreated(data.id);
    },
    onError: (error: Error) => {
        toast({
            title: "Error Creating Case",
            description: error.message,
            variant: "destructive",
        });
    }
  });

  const handleSubmitCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !patientId || !selectedHospitalId || !eta) {
        toast({
            title: "Missing Information",
            description: "Please select a hospital and provide an ETA.",
            variant: "destructive"
        });
        return;
    }

    const caseData = {
        patient_id: patientId,
        paramedic_id: user.id,
        hospital_id: selectedHospitalId,
        severity: severity,
        eta_minutes: parseInt(eta, 10),
        paramedic_notes: paramedicNotes,
        vitals: extractedVitals,
    };

    createCaseMutation.mutate(caseData);
  };

  return (
    <div className="space-y-6">
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
      
      <form onSubmit={handleSubmitCase}>
        <Card>
            <CardHeader>
                <CardTitle>Dispatch Case</CardTitle>
                <CardDescription>Complete the case details and send to the hospital.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="hospital">Receiving Hospital</Label>
                        <Select onValueChange={setSelectedHospitalId} value={selectedHospitalId} required disabled={isLoadingHospitals || createCaseMutation.isPending}>
                            <SelectTrigger id="hospital">
                                <SelectValue placeholder={isLoadingHospitals ? "Loading hospitals..." : "Select a hospital"} />
                            </SelectTrigger>
                            <SelectContent>
                                {hospitals?.map(hospital => (
                                    <SelectItem key={hospital.id} value={hospital.id}>{hospital.full_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="severity">Case Severity</Label>
                        <Select onValueChange={(v) => setSeverity(v as any)} value={severity} required disabled={createCaseMutation.isPending}>
                            <SelectTrigger id="severity">
                                <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Stable">Stable</SelectItem>
                                <SelectItem value="Urgent">Urgent</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <Label htmlFor="eta">ETA (minutes)</Label>
                    <Input id="eta" type="number" placeholder="e.g., 15" value={eta} required onChange={e => setEta(e.target.value)} disabled={createCaseMutation.isPending} />
                </div>
                <div>
                    <Label htmlFor="notes">Paramedic Notes</Label>
                    <Textarea id="notes" placeholder="Add any additional notes for the hospital..." value={paramedicNotes} onChange={e => setParamedicNotes(e.target.value)} disabled={createCaseMutation.isPending} rows={4} />
                </div>
            </CardContent>
            <CardFooter>
                 <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={!extractedVitals || createCaseMutation.isPending}>
                    {createCaseMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Case...</> : 'Create & Dispatch Case'}
                </Button>
            </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default VoiceToVitals;
