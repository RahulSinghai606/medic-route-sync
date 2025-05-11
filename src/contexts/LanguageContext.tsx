
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'as' | 'mz' | 'kh' | 'nm' | 'bo';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations for all supported languages
const translations: Record<Language, Record<string, string>> = {
  en: {
    // General UI
    'app.title': 'TERO',
    'app.subtitle': 'Triage and Emergency Routing Optimization',
    'dashboard': 'Dashboard',
    'assessment': 'Assessment',
    'hospitals': 'Hospitals',
    'patients': 'Patients',
    'cases': 'Cases',
    'logout': 'Logout',
    'paramedic': 'Paramedic',
    'status.available': 'Available',
    'status.busy': 'Busy',
    'status.offline': 'Offline',
    
    // Voice to Vitals
    'vitals.title': 'Voice-to-Vitals',
    'vitals.description': 'Record your voice to automatically extract vital signs',
    'vitals.start': 'Start Recording',
    'vitals.stop': 'Stop Recording',
    'vitals.play': 'Play Recording',
    'vitals.extract': 'Extract Vitals',
    'vitals.processing': 'Processing...',
    'vitals.tips': 'Tips:',
    'vitals.tip1': 'Speak clearly and at a normal pace',
    'vitals.tip2': 'Include vital sign values with their names (e.g., "Blood pressure 120 over 80")',
    'vitals.tip3': 'Use medical terminology for better recognition',
    'vitals.tip4': 'Mention measurements with their units (e.g., "38 degrees celsius")',
    'vitals.tip5': 'Say "SpO2" as "S-P-O-2" or "oxygen saturation" for better recognition',
    
    // Clinical Assessment
    'assessment.title': 'AI Clinical Assessment',
    'assessment.probability': 'Clinical Probability',
    'assessment.recommendations': 'Care Recommendations',
    'assessment.specialties': 'Specialty Requirements',
    'assessment.hospital': 'Find Matching Hospitals',
    'assessment.loading': 'Processing clinical information...',
    'assessment.unavailable': 'No AI assessment available yet.',
    'assessment.record': 'Record patient vitals with voice input to generate an assessment.',
    
    // Hospitals
    'hospitals.nearby': 'Nearby Hospitals',
    'hospitals.description': 'Hospitals close to your current location',
    'hospitals.find': 'Find Nearest Hospitals',
    'hospitals.match': 'Match Score',
    'hospitals.eta': 'ETA',
    'hospitals.beds': 'Available Beds',
    'hospitals.icu': 'ICU Capacity',
    'hospitals.specialties': 'Specialties',
    
    // Location
    'location.title': 'Paramedic Location',
    'location.description': 'Your current GPS coordinates',
    'location.current': 'Current Location:',
    'location.gps': 'GPS:',
    'location.refresh': 'Refresh',
    'location.error': 'Location Error',
    'location.loading': 'Getting your location...',
    'location.denied': 'Location access was denied. Please enable location services in your browser settings.',
    'location.unavailable': 'Location information is unavailable. Please try again later.',
    'location.timeout': 'Location request timed out. Please try again.',
    
    // Language selector
    'language.select': 'Select Language',
    'language.en': 'English 🇬🇧',
    'language.hi': 'Hindi 🇮🇳',
    'language.as': 'Assamese',
    'language.mz': 'Mizo',
    'language.kh': 'Khasi',
    'language.nm': 'Nagamese',
    'language.bo': 'Bodo'
  },
  hi: {
    // General UI
    'app.title': 'टेरो',
    'app.subtitle': 'त्रिएज और आपातकालीन मार्ग अनुकूलन',
    'dashboard': 'डैशबोर्ड',
    'assessment': 'मूल्यांकन',
    'hospitals': 'अस्पताल',
    'patients': 'मरीज़',
    'cases': 'केस',
    'logout': 'लॉगआउट',
    'paramedic': 'पैरामेडिक',
    'status.available': 'उपलब्ध',
    'status.busy': 'व्यस्त',
    'status.offline': 'ऑफ़लाइन',
    
    // Voice to Vitals
    'vitals.title': 'वॉइस-टू-वाइटल्स',
    'vitals.description': 'महत्वपूर्ण लक्षणों को स्वचालित रूप से निकालने के लिए अपनी आवाज़ रिकॉर्ड करें',
    'vitals.start': 'रिकॉर्डिंग शुरू करें',
    'vitals.stop': 'रिकॉर्डिंग बंद करें',
    'vitals.play': 'रिकॉर्डिंग सुनें',
    'vitals.extract': 'वाइटल्स निकालें',
    'vitals.processing': 'प्रोसेसिंग...',
    'vitals.tips': 'युक्तियाँ:',
    'vitals.tip1': 'स्पष्ट रूप से और सामान्य गति से बोलें',
    'vitals.tip2': 'वाइटल सिग्नल मूल्यों को उनके नामों के साथ शामिल करें (जैसे, "ब्लड प्रेशर 120 पर 80")',
    'vitals.tip3': 'बेहतर पहचान के लिए चिकित्सा शब्दावली का उपयोग करें',
    'vitals.tip4': 'अपने इकाइयों के साथ माप का उल्लेख करें (जैसे, "38 डिग्री सेल्सियस")',
    'vitals.tip5': '"SpO2" को "एस-पी-ओ-2" या "ऑक्सीजन सैचुरेशन" के रूप में कहें',
    
    // Clinical Assessment
    'assessment.title': 'AI क्लिनिकल असेसमेंट',
    'assessment.probability': 'क्लिनिकल प्रोबेबिलिटी',
    'assessment.recommendations': 'देखभाल की सिफारिशें',
    'assessment.specialties': 'विशेषज्ञता आवश्यकताएं',
    'assessment.hospital': 'मिलते-जुलते अस्पताल खोजें',
    'assessment.loading': 'क्लिनिकल जानकारी प्रोसेस की जा रही है...',
    'assessment.unavailable': 'अभी तक कोई AI असेसमेंट उपलब्ध नहीं है।',
    'assessment.record': 'असेसमेंट तैयार करने के लिए वॉइस इनपुट से मरीज के वाइटल्स रिकॉर्ड करें।',
    
    // Hospitals
    'hospitals.nearby': 'आसपास के अस्पताल',
    'hospitals.description': 'आपके वर्तमान स्थान के पास के अस्पताल',
    'hospitals.find': 'नजदीकी अस्पताल खोजें',
    'hospitals.match': 'मैच स्कोर',
    'hospitals.eta': 'अनुमानित समय',
    'hospitals.beds': 'उपलब्ध बेड',
    'hospitals.icu': 'ICU क्षमता',
    'hospitals.specialties': 'विशेषताएँ',
    
    // Location
    'location.title': 'पैरामेडिक स्थान',
    'location.description': 'आपके वर्तमान GPS निर्देशांक',
    'location.current': 'वर्तमान स्थान:',
    'location.gps': 'GPS:',
    'location.refresh': 'रिफ्रेश',
    'location.error': 'स्थान त्रुटि',
    'location.loading': 'आपका स्थान प्राप्त किया जा रहा है...',
    'location.denied': 'स्थान पहुँच को अस्वीकार कर दिया गया था। कृपया अपने ब्राउज़र सेटिंग्स में स्थान सेवाओं को सक्षम करें।',
    'location.unavailable': 'स्थान की जानकारी उपलब्ध नहीं है। कृपया बाद में पुन: प्रयास करें।',
    'location.timeout': 'स्थान अनुरोध का समय समाप्त हो गया। कृपया पुन: प्रयास करें।',
    
    // Language selector
    'language.select': 'भाषा चुनें',
    'language.en': 'अंग्रेज़ी 🇬🇧',
    'language.hi': 'हिंदी 🇮🇳',
    'language.as': 'असमिया',
    'language.mz': 'मिज़ो',
    'language.kh': 'खासी',
    'language.nm': 'नागामीज़',
    'language.bo': 'बोडो'
  },
  // Simplified translations for other languages - duplicate Hindi translations for now as placeholders
  as: { /* Same keys as Hindi translations, but would be in Assamese */ },
  mz: { /* Same keys as Hindi translations, but would be in Mizo */ },
  kh: { /* Same keys as Hindi translations, but would be in Khasi */ },
  nm: { /* Same keys as Hindi translations, but would be in Nagamese */ },
  bo: { /* Same keys as Hindi translations, but would be in Bodo */ }
};

// Initialize other languages with Hindi translations as placeholders
const fallbackLanguages = ['as', 'mz', 'kh', 'nm', 'bo'] as const;
fallbackLanguages.forEach(lang => {
  translations[lang] = { ...translations['hi'] };
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language preference from local storage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language preference to local storage when it changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    // Check if key exists in current language
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    
    // Fallback to English
    if (translations.en[key]) {
      return translations.en[key];
    }
    
    // If key doesn't exist at all, return the key itself
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };

  const contextValue = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
