
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language translations
const translations = {
  en: {
    'app.title': 'TERO',
    'app.subtitle': 'Triage and Emergency Routing Optimization',
    'paramedic': 'Paramedic',
    'language.select': 'Select Language',
    'location.title': 'Paramedic Location',
    'location.description': 'Current location and time information',
    'location.loading': 'Getting your location...',
    'location.current': 'Current Location',
    'location.gps': 'GPS Coordinates:',
    'location.error': 'Unable to access location. Please enable location services.',
    'hospitals.nearby': 'Nearby Hospitals',
    'hospitals.description': 'Real-time hospital locations based on your GPS coordinates',
    'hospitals.beds': 'Beds',
    'hospitals.icu': 'ICU',
    'hospitals.eta': 'Total Time',
    'hospitals.specialties': 'Specialties',
    'hebbal.title': 'Recommended Hospitals',
    'hebbal.description': 'Best hospitals ranked by patient match',
  },
  hi: {
    'app.title': 'टेरो',
    'app.subtitle': 'त्रिकोणीय और आपातकालीन मार्ग अनुकूलन',
    'paramedic': 'चिकित्सक',
    'language.select': 'भाषा चुनें',
    'location.title': 'चिकित्सक स्थान',
    'location.description': 'वर्तमान स्थान और समय की जानकारी',
    'location.loading': 'आपका स्थान प्राप्त कर रहे हैं...',
    'location.current': 'वर्तमान स्थान',
    'location.gps': 'जीपीएस निर्देशांक:',
    'location.error': 'स्थान तक पहुंचने में असमर्थ। कृपया स्थान सेवाएं सक्षम करें।',
    'hospitals.nearby': 'निकटतम अस्पताल',
    'hospitals.description': 'आपके जीपीएस निर्देशांक के आधार पर वास्तविक समय अस्पताल स्थान',
    'hospitals.beds': 'बिस्तर',
    'hospitals.icu': 'आईसीयू',
    'hospitals.eta': 'कुल समय',
    'hospitals.specialties': 'विशेषताएं',
    'hebbal.title': 'अनुशंसित अस्पताल',
    'hebbal.description': 'रोगी मैच द्वारा रैंक किए गए सर्वोत्तम अस्पताल',
  },
  kn: {
    'app.title': 'ಟೆರೋ',
    'app.subtitle': 'ತ್ರಿಕೋನ ಮತ್ತು ತುರ್ತು ಮಾರ್ಗ ಅನುಕೂಲತೆ',
    'paramedic': 'ವೈದ್ಯ',
    'language.select': 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    'location.title': 'ವೈದ್ಯ ಸ್ಥಾನ',
    'location.description': 'ಪ್ರಸ್ತುತ ಸ್ಥಾನ ಮತ್ತು ಸಮಯದ ಮಾಹಿತಿ',
    'location.loading': 'ನಿಮ್ಮ ಸ್ಥಾನವನ್ನು ಪಡೆಯುತ್ತಿದ್ದೇವೆ...',
    'location.current': 'ಪ್ರಸ್ತುತ ಸ್ಥಾನ',
    'location.gps': 'ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳು:',
    'location.error': 'ಸ್ಥಾನವನ್ನು ಪ್ರವೇಶಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಥಾನ ಸೇವೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.',
    'hospitals.nearby': 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು',
    'hospitals.description': 'ನಿಮ್ಮ ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳ ಆಧಾರದ ಮೇಲೆ ನೈಜ-ಸಮಯದ ಆಸ್ಪತ್ರೆ ಸ್ಥಾನಗಳು',
    'hospitals.beds': 'ಹಾಸಿಗೆಗಳು',
    'hospitals.icu': 'ಐಸಿಯು',
    'hospitals.eta': 'ಒಟ್ಟು ಸಮಯ',
    'hospitals.specialties': 'ವಿಶೇಷತೆಗಳು',
    'hebbal.title': 'ಶಿಫಾರಸು ಮಾಡಿದ ಆಸ್ಪತ್ರೆಗಳು',
    'hebbal.description': 'ರೋಗಿಯ ಹೊಂದಾಣಿಕೆಯಿಂದ ಶ್ರೇಣೀಕೃತ ಅತ್ಯುತ್ತಮ ಆಸ್ಪತ್ರೆಗಳು',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'hi', 'kn'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
