import { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Language, getTranslation } from './translations';

export const useLanguage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    // Verificar parâmetro de idioma na URL
    const langParam = searchParams.get('l');
    
    if (langParam === 'en' || langParam === 'pt') {
      setLanguage(langParam);
    } else {
      // Padrão é português
      setLanguage('pt');
    }
  }, [searchParams]);

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    
    // Atualizar URL com novo parâmetro de idioma
    const url = new URL(window.location.href);
    if (newLang === 'pt') {
      url.searchParams.delete('l'); // Remover parâmetro se for português (padrão)
    } else {
      url.searchParams.set('l', newLang);
    }
    
    window.history.pushState({}, '', url.toString());
  };

  const t = getTranslation(language);

  return {
    language,
    changeLanguage,
    t,
    isEnglish: language === 'en',
    isPortuguese: language === 'pt'
  };
};
