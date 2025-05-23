
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'kn';

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
    
    // Additional translations for hebbal hospitals
    'hebbal.title': 'Hebbal Hospitals - Courtyard Bengaluru',
    'hebbal.description': 'Emergency facility matching nearby Hebbal'
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
    
    // Additional translations for hebbal hospitals
    'hebbal.title': 'हेब्बल अस्पताल - कॉर्टयार्ड बेंगलुरु',
    'hebbal.description': 'हेब्बल के पास आपातकालीन सुविधा मिलान'
  },
  
  // Kannada translations
  kn: {
    // General UI
    'app.title': 'ಟೆರೋ',
    'app.subtitle': 'ತ್ರಿಯೇಜ್ ಮತ್ತು ತುರ್ತು ಮಾರ್ಗ ಅನುಕೂಲೀಕರಣ',
    'dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'assessment': 'ಮೌಲ್ಯಮಾಪನ',
    'hospitals': 'ಆಸ್ಪತ್ರೆಗಳು',
    'patients': 'ರೋಗಿಗಳು',
    'cases': 'ಪ್ರಕರಣಗಳು',
    'logout': 'ಲಾಗ್ ಔಟ್',
    'paramedic': 'ವೈದ್ಯಕೀಯ ಸಿಬ್ಬಂದಿ',
    'status.available': 'ಲಭ್ಯವಿದೆ',
    'status.busy': 'ಕಾರ್ಯನಿರತ',
    'status.offline': 'ಆಫ್‌ಲೈನ್',
    
    // Voice to Vitals
    'vitals.title': 'ಧ್ವನಿ-ಟು-ವೈಟಲ್ಸ್',
    'vitals.description': 'ಜೀವನಾಧಾರ ಚಿಹ್ನೆಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಹೊರತೆಗೆಯಲು ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ',
    'vitals.start': 'ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
    'vitals.stop': 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ',
    'vitals.play': 'ರೆಕಾರ್ಡಿಂಗ್ ಪ್ಲೇ ಮಾಡಿ',
    'vitals.extract': 'ಜೀವನಾಧಾರ ಚಿಹ್ನೆಗಳನ್ನು ಹೊರತೆಗೆಯಿರಿ',
    'vitals.processing': 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...',
    'vitals.tips': 'ಸಲಹೆಗಳು:',
    'vitals.tip1': 'ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತು ಸಾಮಾನ್ಯ ವೇಗದಲ್ಲಿ ಮಾತನಾಡಿ',
    'vitals.tip2': 'ಜೀವನಾಧಾರ ಚಿಹ್ನೆಗಳ ಮೌಲ್ಯಗಳನ್ನು ಅವುಗಳ ಹೆಸರುಗಳೊಂದಿಗೆ ಸೇರಿಸಿ (ಉದಾ., "ರಕ್ತದೊತ್ತಡ 120 ಓವರ್ 80")',
    'vitals.tip3': 'ಉತ್ತಮ ಗುರುತಿಸುವಿಕೆಗಾಗಿ ವೈದ್ಯಕೀಯ ಪದಜಾಲವನ್ನು ಬಳಸಿ',
    'vitals.tip4': 'ಅಳತೆಗಳನ್ನು ಅವುಗಳ ಘಟಕಗಳೊಂದಿಗೆ ಉಲ್ಲೇಖಿಸಿ (ಉದಾ., "38 ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್")',
    'vitals.tip5': '"SpO2" ಅನ್ನು "ಎಸ್-ಪಿ-ಓ-2" ಅಥವಾ "ಆಕ್ಸಿಜನ್ ಸ್ಯಾಚುರೇಷನ್" ಎಂದು ಹೇಳಿ',
    
    // Clinical Assessment
    'assessment.title': 'AI ಕ್ಲಿನಿಕಲ್ ಮೌಲ್ಯಮಾಪನ',
    'assessment.probability': 'ಕ್ಲಿನಿಕಲ್ ಸಂಭವನೀಯತೆ',
    'assessment.recommendations': 'ಆರೈಕೆ ಶಿಫಾರಸುಗಳು',
    'assessment.specialties': 'ವಿಶೇಷ ಅಗತ್ಯತೆಗಳು',
    'assessment.hospital': 'ಹೊಂದಾಣಿಕೆಯ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ',
    'assessment.loading': 'ಕ್ಲಿನಿಕಲ್ ಮಾಹಿತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
    'assessment.unavailable': 'ಇನ್ನೂ AI ಮೌಲ್ಯಮಾಪನ ಲಭ್ಯವಿಲ್ಲ.',
    'assessment.record': 'ಮೌಲ್ಯಮಾಪನ ರಚಿಸಲು ಧ್ವನಿ ಇನ್‌ಪುಟ್‌ನೊಂದಿಗೆ ರೋಗಿಯ ಜೀವನಾಧಾರ ಚಿಹ್ನೆಗಳನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ.',
    
    // Hospitals
    'hospitals.nearby': 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು',
    'hospitals.description': 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳದ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು',
    'hospitals.find': 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ',
    'hospitals.match': 'ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್',
    'hospitals.eta': 'ETA',
    'hospitals.beds': 'ಲಭ್ಯವಿರುವ ಹಾಸಿಗೆಗಳು',
    'hospitals.icu': 'ICU ಸಾಮರ್ಥ್ಯ',
    'hospitals.specialties': 'ವಿಶೇಷತೆಗಳು',
    
    // Location
    'location.title': 'ವೈದ್ಯಕೀಯ ಸಿಬ್ಬಂದಿ ಸ್ಥಳ',
    'location.description': 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ GPS ನಿರ್ದೇಶಾಂಕಗಳು',
    'location.current': 'ಪ್ರಸ್ತುತ ಸ್ಥಳ:',
    'location.gps': 'GPS:',
    'location.refresh': 'ರಿಫ್ರೆಶ್',
    'location.error': 'ಸ್ಥಳ ದೋಷ',
    'location.loading': 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...',
    'location.denied': 'ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಸ್ಥಳ ಸೇವೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.',
    'location.unavailable': 'ಸ್ಥಳ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    'location.timeout': 'ಸ್ಥಳ ವಿನಂತಿ ಸಮಯ ಮೀರಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    
    // Language selector
    'language.select': 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    
    // Additional translations for hebbal hospitals
    'hebbal.title': 'ಹೆಬ್ಬಾಳ ಆಸ್ಪತ್ರೆಗಳು - ಕೋರ್ಟ್‌ಯಾರ್ಡ್ ಬೆಂಗಳೂರು',
    'hebbal.description': 'ಹೆಬ್ಬಾಳದ ಸಮೀಪದ ತುರ್ತು ಸೌಲಭ್ಯ ಹೊಂದಾಣಿಕೆ'
  }
};

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
