import { createContext, useContext, useEffect, useState } from 'react';
import i18n from '@/i18n';

type Language = 'zh-CN' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'zh-CN',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('zh-CN');

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') as Language | null;
    const initialLanguage = savedLanguage || 'zh-CN';
    i18n.changeLanguage(initialLanguage);
    setLanguageState(initialLanguage);
    setIsInitialized(true);
  }, []);

  const setLanguage = (language: Language) => {
    i18n.changeLanguage(language);
    setLanguageState(language);
    localStorage.setItem('i18nextLng', language);
    document.cookie = `i18nextLng=${language}; path=/; max-age=31536000`;
  };

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguageState(lng as Language);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
