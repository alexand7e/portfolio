import React from 'react';
import { useLanguage } from '@/lib/useLanguage';
import { FiGlobe } from 'react-icons/fi';

export default function LanguageSelector() {
  const { language, changeLanguage, isEnglish, isPortuguese } = useLanguage();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 text-tertiary hover:text-accent transition-colors"
        onClick={() => changeLanguage(isEnglish ? 'pt' : 'en')}
        title={isEnglish ? 'Mudar para Português' : 'Change to English'}
      >
        <FiGlobe size={16} />
        <span className="text-sm font-medium">
          {isEnglish ? 'EN' : 'PT'}
        </span>
      </button>
      
      <div className="absolute right-0 top-full mt-2 bg-secondary border border-accent rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          <button
            onClick={() => changeLanguage('pt')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-primary transition-colors ${
              isPortuguese ? 'text-accent bg-accent/10' : 'text-tertiary'
            }`}
          >
            🇧🇷 Português
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-primary transition-colors ${
              isEnglish ? 'text-accent bg-accent/10' : 'text-tertiary'
            }`}
          >
            🇺🇸 English
          </button>
        </div>
      </div>
    </div>
  );
}
