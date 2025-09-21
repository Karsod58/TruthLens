interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
}

interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export class TranslationService {
  private apiKey: string;
  private baseUrl = 'https://translation.googleapis.com/language/translate/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Translate text to target language
  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<TranslationResult> {
    try {
      // Get Supabase info
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-76a6fe9f/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          sourceLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        translatedText: data.translatedText,
        detectedLanguage: data.detectedLanguage,
        confidence: 1.0
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  // Detect language of text
  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    try {
      // Get Supabase info
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-76a6fe9f/detect-language`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          text
        })
      });

      if (!response.ok) {
        throw new Error(`Language detection error: ${response.status}`);
      }

      const data = await response.json();

      return {
        language: data.language,
        confidence: data.confidence || 0.5
      };
    } catch (error) {
      console.error('Language detection error:', error);
      throw error;
    }
  }

  // Get supported languages
  async getSupportedLanguages(targetLanguage: string = 'en'): Promise<SupportedLanguage[]> {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2/languages?key=${this.apiKey}&target=${targetLanguage}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Supported languages error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.data.languages.map((lang: any) => ({
        code: lang.language,
        name: lang.name,
        nativeName: lang.name
      }));
    } catch (error) {
      console.error('Get supported languages error:', error);
      throw error;
    }
  }

  // Common language mappings
  getCommonLanguages(): SupportedLanguage[] {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
      { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
      { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
      { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
      { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
      { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ' },
      { code: 'th', name: 'Thai', nativeName: 'ไทย' },
      { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
      { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
      { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
      { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' }
    ];
  }

  // Format language name for display
  formatLanguageDisplay(languageCode: string): string {
    const language = this.getCommonLanguages().find(lang => lang.code === languageCode);
    return language ? `${language.name} (${language.nativeName})` : languageCode;
  }
}

// Export singleton instance
export const translationService = new TranslationService(import.meta.env.VITE_GOOGLE_CLOUD_API_KEY || '');