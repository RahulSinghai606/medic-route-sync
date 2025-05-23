
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Enhanced translations with proper medical terminology
const translations = {
  en: {
    // Vitals section
    'vitals.title': 'Voice to Vitals',
    'vitals.description': 'Record your voice to extract vital signs',
    'vitals.start': 'Start Recording',
    'vitals.stop': 'Stop Recording',
    'vitals.play': 'Play Recording',
    'vitals.extract': 'Extract Vitals',
    'vitals.processing': 'Processing...',
    'vitals.tips': 'Tips for better recognition:',
    'vitals.tip1': 'Speak clearly and slowly',
    'vitals.tip2': 'Include units (e.g., "bpm", "mmHg")',
    'vitals.tip3': 'State each vital sign separately',
    'vitals.tip4': 'Use medical terminology when possible',
    'vitals.tip5': 'Mention symptoms and observations',

    // Assessment section
    'assessment.title': 'AI Clinical Assessment',
    'assessment.loading': 'Analyzing patient data...',
    'assessment.unavailable': 'Assessment unavailable',
    'assessment.record': 'Please record patient information first',
    'assessment.probability': 'Clinical Probability',
    'assessment.recommendations': 'Care Recommendations',
    'assessment.specialties': 'Medical Specialties',
    'assessment.hospital': 'Find Hospitals',

    // Location and hospitals
    'location.updated': 'Location Updated',
    'location.success': 'Location detected successfully',
    'location.error': 'Location access denied',
    'location.error.title': 'Location Error',
    'getting.location': 'Getting Location...',
    'use.location': 'Use My Location',
    'select.city': 'Select City',
    'your.location': 'Your Location',
    'hospitals.nearby': 'Nearby Hospitals',
    'hospitals.description': 'Find the best hospitals for your medical needs',
    'within.radius': 'within 30km',
    'hospitals.type.government': 'Government',
    'hospitals.type.private': 'Private',
    'hospitals.type.multispecialty': 'Multi-specialty',
    'hospitals.type.speciality': 'Specialty',
    'match': 'Match',
    'promoted': 'Recommended',
    'km': 'km away',
    'eta.label': 'ETA',
    'min': 'min',
    'hospitals.beds': 'Available Beds',
    'hospitals.call': 'Call',
    'hospitals.directions': 'Directions',
    'hospitals.refresh': 'Refresh Hospitals',
    'hospitals.getting.directions': 'Opening directions to',
    'no.hospitals.found': 'No Hospitals Found',
    'no.hospitals.description': 'Try expanding your search area or check your location',
    'error.no.location': 'Location Required',
    'error.directions': 'Please enable location access to get directions',
    'error.opening.directions': 'Opening Directions'
  },
  hi: {
    // Vitals section
    'vitals.title': 'आवाज से जीवन संकेत',
    'vitals.description': 'जीवन संकेत निकालने के लिए अपनी आवाज रिकॉर्ड करें',
    'vitals.start': 'रिकॉर्डिंग शुरू करें',
    'vitals.stop': 'रिकॉर्डिंग रोकें',
    'vitals.play': 'रिकॉर्डिंग चलाएं',
    'vitals.extract': 'जीवन संकेत निकालें',
    'vitals.processing': 'प्रसंस्करण हो रहा है...',
    'vitals.tips': 'बेहतर पहचान के लिए सुझाव:',
    'vitals.tip1': 'स्पष्ट और धीरे बोलें',
    'vitals.tip2': 'इकाइयों को शामिल करें (जैसे "प्रति मिनट", "mmHg")',
    'vitals.tip3': 'प्रत्येक जीवन संकेत अलग-अलग बताएं',
    'vitals.tip4': 'जब संभव हो तो चिकित्सा शब्दावली का उपयोग करें',
    'vitals.tip5': 'लक्षण और अवलोकन का उल्लेख करें',

    // Assessment section
    'assessment.title': 'एआई चिकित्सा मूल्यांकन',
    'assessment.loading': 'रोगी डेटा का विश्लेषण हो रहा है...',
    'assessment.unavailable': 'मूल्यांकन उपलब्ध नहीं',
    'assessment.record': 'कृपया पहले रोगी की जानकारी रिकॉर्ड करें',
    'assessment.probability': 'चिकित्सा संभावना',
    'assessment.recommendations': 'देखभाल सुझाव',
    'assessment.specialties': 'चिकित्सा विशेषज्ञताएं',
    'assessment.hospital': 'अस्पताल खोजें',

    // Location and hospitals
    'location.updated': 'स्थान अपडेट किया गया',
    'location.success': 'स्थान सफलतापूर्वक पता लगाया गया',
    'location.error': 'स्थान पहुंच अस्वीकृत',
    'location.error.title': 'स्थान त्रुटि',
    'getting.location': 'स्थान प्राप्त कर रहे हैं...',
    'use.location': 'मेरा स्थान उपयोग करें',
    'select.city': 'शहर चुनें',
    'your.location': 'आपका स्थान',
    'hospitals.nearby': 'नजदीकी अस्पताल',
    'hospitals.description': 'अपनी चिकित्सा आवश्यकताओं के लिए सर्वोत्तम अस्पताल खोजें',
    'within.radius': '30 किमी के भीतर',
    'hospitals.type.government': 'सरकारी',
    'hospitals.type.private': 'निजी',
    'hospitals.type.multispecialty': 'बहु-विशेषता',
    'hospitals.type.speciality': 'विशेषता',
    'match': 'मेल',
    'promoted': 'अनुशंसित',
    'km': 'किमी दूर',
    'eta.label': 'पहुंचने का समय',
    'min': 'मिनट',
    'hospitals.beds': 'उपलब्ध बिस्तर',
    'hospitals.call': 'कॉल करें',
    'hospitals.directions': 'दिशा-निर्देश',
    'hospitals.refresh': 'अस्पताल रीफ्रेश करें',
    'hospitals.getting.directions': 'दिशा-निर्देश खोल रहे हैं',
    'no.hospitals.found': 'कोई अस्पताल नहीं मिला',
    'no.hospitals.description': 'अपने खोज क्षेत्र का विस्तार करने या अपना स्थान जांचने का प्रयास करें',
    'error.no.location': 'स्थान आवश्यक',
    'error.directions': 'दिशा-निर्देश प्राप्त करने के लिए कृपया स्थान पहुंच सक्षम करें',
    'error.opening.directions': 'दिशा-निर्देश खोल रहे हैं'
  },
  kn: {
    // Vitals section
    'vitals.title': 'ಧ್ವನಿಯಿಂದ ಜೀವನ ಚಿಹ್ನೆಗಳು',
    'vitals.description': 'ಜೀವನ ಚಿಹ್ನೆಗಳನ್ನು ಹೊರತೆಗೆಯಲು ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ',
    'vitals.start': 'ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
    'vitals.stop': 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ',
    'vitals.play': 'ರೆಕಾರ್ಡಿಂಗ್ ಪ್ಲೇ ಮಾಡಿ',
    'vitals.extract': 'ಜೀವನ ಚಿಹ್ನೆಗಳನ್ನು ಹೊರತೆಗೆಯಿರಿ',
    'vitals.processing': 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
    'vitals.tips': 'ಉತ್ತಮ ಗುರುತಿಸುವಿಕೆಗಾಗಿ ಸಲಹೆಗಳು:',
    'vitals.tip1': 'ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ',
    'vitals.tip2': 'ಘಟಕಗಳನ್ನು ಸೇರಿಸಿ (ಉದಾ. "ಪ್ರತಿ ನಿಮಿಷ", "mmHg")',
    'vitals.tip3': 'ಪ್ರತಿ ಜೀವನ ಚಿಹ್ನೆಯನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ತಿಳಿಸಿ',
    'vitals.tip4': 'ಸಾಧ್ಯವಾದಾಗ ವೈದ್ಯಕೀಯ ಪರಿಭಾಷೆಯನ್ನು ಬಳಸಿ',
    'vitals.tip5': 'ಲಕ್ಷಣಗಳು ಮತ್ತು ಅವಲೋಕನಗಳನ್ನು ಉಲ್ಲೇಖಿಸಿ',

    // Assessment section
    'assessment.title': 'AI ವೈದ್ಯಕೀಯ ಮೌಲ್ಯಮಾಪನ',
    'assessment.loading': 'ರೋಗಿಯ ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    'assessment.unavailable': 'ಮೌಲ್ಯಮಾಪನ ಲಭ್ಯವಿಲ್ಲ',
    'assessment.record': 'ದಯವಿಟ್ಟು ಮೊದಲು ರೋಗಿಯ ಮಾಹಿತಿಯನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ',
    'assessment.probability': 'ವೈದ್ಯಕೀಯ ಸಂಭವನೀಯತೆ',
    'assessment.recommendations': 'ಆರೈಕೆ ಶಿಫಾರಸುಗಳು',
    'assessment.specialties': 'ವೈದ್ಯಕೀಯ ವಿಶೇಷತೆಗಳು',
    'assessment.hospital': 'ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ',

    // Location and hospitals
    'location.updated': 'ಸ್ಥಳ ನವೀಕರಿಸಲಾಗಿದೆ',
    'location.success': 'ಸ್ಥಳವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪತ್ತೆ ಮಾಡಲಾಗಿದೆ',
    'location.error': 'ಸ್ಥಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ',
    'location.error.title': 'ಸ್ಥಳ ದೋಷ',
    'getting.location': 'ಸ್ಥಳವನ್ನು ಪಡೆಯುತ್ತಿದೆ...',
    'use.location': 'ನನ್ನ ಸ್ಥಳವನ್ನು ಬಳಸಿ',
    'select.city': 'ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'your.location': 'ನಿಮ್ಮ ಸ್ಥಳ',
    'hospitals.nearby': 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು',
    'hospitals.description': 'ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಅವಶ್ಯಕತೆಗಳಿಗಾಗಿ ಅತ್ಯುತ್ತಮ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ',
    'within.radius': '30 ಕಿಮೀ ಒಳಗೆ',
    'hospitals.type.government': 'ಸರ್ಕಾರಿ',
    'hospitals.type.private': 'ಖಾಸಗಿ',
    'hospitals.type.multispecialty': 'ಬಹು-ವಿಶೇಷತೆ',
    'hospitals.type.speciality': 'ವಿಶೇಷತೆ',
    'match': 'ಹೊಂದಾಣಿಕೆ',
    'promoted': 'ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
    'km': 'ಕಿಮೀ ದೂರ',
    'eta.label': 'ಪ್ರಯಾಣ ಸಮಯ',
    'min': 'ನಿಮಿಷ',
    'hospitals.beds': 'ಲಭ್ಯವಿರುವ ಹಾಸಿಗೆಗಳು',
    'hospitals.call': 'ಕರೆ ಮಾಡಿ',
    'hospitals.directions': 'ದಿಕ್ಕುಗಳು',
    'hospitals.refresh': 'ಆಸ್ಪತ್ರೆಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ',
    'hospitals.getting.directions': 'ದಿಕ್ಕುಗಳನ್ನು ತೆರೆಯುತ್ತಿದೆ',
    'no.hospitals.found': 'ಯಾವುದೇ ಆಸ್ಪತ್ರೆ ಕಂಡುಬಂದಿಲ್ಲ',
    'no.hospitals.description': 'ನಿಮ್ಮ ಹುಡುಕಾಟ ಪ್ರದೇಶವನ್ನು ವಿಸ್ತರಿಸಲು ಅಥವಾ ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪರಿಶೀಲಿಸಲು ಪ್ರಯತ್ನಿಸಿ',
    'error.no.location': 'ಸ್ಥಳ ಅಗತ್ಯವಿದೆ',
    'error.directions': 'ದಿಕ್ಕುಗಳನ್ನು ಪಡೆಯಲು ದಯವಿಟ್ಟು ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ',
    'error.opening.directions': 'ದಿಕ್ಕುಗಳನ್ನು ತೆರೆಯುತ್ತಿದೆ'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
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
