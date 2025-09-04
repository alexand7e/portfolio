import React from 'react';
import { useLanguage } from '@/lib/useLanguage';

export default function LanguageTest() {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <div className="fixed bottom-4 right-4 bg-secondary border border-accent rounded-lg p-4 shadow-lg z-50">
      <div className="text-sm text-tertiary mb-2">
        <strong>Idioma atual:</strong> {language === 'pt' ? '🇧🇷 Português' : '🇺🇸 English'}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => changeLanguage('pt')}
          className={`px-3 py-1 text-xs rounded ${
            language === 'pt' 
              ? 'bg-accent text-primary' 
              : 'bg-primary text-tertiary hover:bg-accent hover:text-primary'
          } transition-colors`}
        >
          🇧🇷 PT
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 text-xs rounded ${
            language === 'en' 
              ? 'bg-accent text-primary' 
              : 'bg-primary text-tertiary hover:bg-accent hover:text-primary'
          } transition-colors`}
        >
          🇺🇸 EN
        </button>
      </div>
      <div className="text-xs text-tertiary mt-2">
        URL: {typeof window !== 'undefined' ? window.location.href : ''}
      </div>
    </div>
  );
}
