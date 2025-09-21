import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Globe, Languages } from 'lucide-react';
import { translationService } from '../services/translation';
import { toast } from 'sonner';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
  compact?: boolean;
}

export function LanguageSelector({ onLanguageChange, compact = false }: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const supportedLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
    { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
    { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ', flag: '🇲🇲' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' }
  ];

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('truthlens-language');
    if (savedLanguage && supportedLanguages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage === currentLanguage) return;

    setIsTranslating(true);
    
    try {
      const selectedLang = supportedLanguages.find(lang => lang.code === newLanguage);
      
      if (selectedLang) {
        setCurrentLanguage(newLanguage);
        localStorage.setItem('truthlens-language', newLanguage);
        
        // Trigger page content translation
        onLanguageChange?.(newLanguage);
        
        toast.success(`Language changed to ${selectedLang.nativeName}`);
        
        // Add a note about UI translation
        if (newLanguage !== 'en') {
          setTimeout(() => {
            toast.info('Interface text will be translated when you analyze content');
          }, 1000);
        }
      }
    } catch (error) {
      toast.error('Failed to change language');
    } finally {
      setIsTranslating(false);
    }
  };

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  if (compact) {
    return (
      <Button variant="ghost" size="sm" className="gap-2">
        <Globe className="h-4 w-4" />
        <span className="text-sm">{currentLang?.flag || '🌐'}</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select 
        value={currentLanguage} 
        onValueChange={handleLanguageChange}
        disabled={isTranslating}
      >
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{currentLang?.flag}</span>
              <span className="text-sm">{currentLang?.nativeName}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
                <span className="text-muted-foreground text-xs">({lang.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isTranslating && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Languages className="h-3 w-3 animate-pulse" />
          <span>Updating...</span>
        </div>
      )}
    </div>
  );
}