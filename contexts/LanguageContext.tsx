import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { translations, TranslationKeys } from '../lib/translations';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeys, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('appLanguage');
      return (savedLang === 'en' || savedLang === 'pt') ? savedLang : 'pt';
    } catch (error) {
      return 'pt';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('appLanguage', language);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  }, [language]);

  const t = useCallback((key: TranslationKeys, replacements?: { [key: string]: string | number }): string => {
    let translation = translations[language][key] || translations['pt'][key] || String(key);
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            translation = translation.replace(`{${rKey}}`, String(replacements[rKey]));
        });
    }
    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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