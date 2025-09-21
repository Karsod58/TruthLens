import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Languages, ArrowRightLeft, Copy, Loader2, Globe, Mic } from 'lucide-react';
import { translationService, TranslationResult } from '../../services/translation';
import { toast } from 'sonner';

interface TranslationWidgetProps {
  initialText?: string;
  onTranslatedText?: (text: string, language: string) => void;
  compact?: boolean;
}

export function TranslationWidget({ initialText, onTranslatedText, compact = false }: TranslationWidgetProps) {
  const [sourceText, setSourceText] = useState(initialText || '');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const commonLanguages = translationService.getCommonLanguages();

  useEffect(() => {
    if (initialText && initialText !== sourceText) {
      setSourceText(initialText);
    }
  }, [initialText]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translationService.translateText(
        sourceText,
        targetLanguage,
        sourceLanguage === 'auto' ? undefined : sourceLanguage
      );

      setTranslatedText(result.translatedText);
      if (result.detectedLanguage) {
        setDetectedLanguage(result.detectedLanguage);
      }

      onTranslatedText?.(result.translatedText, targetLanguage);
      toast.success('Translation completed!');
    } catch (error) {
      console.error('Translation failed:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDetectLanguage = async () => {
    if (!sourceText.trim()) {
      toast.error('Please enter text to detect language');
      return;
    }

    setIsDetecting(true);
    try {
      const result = await translationService.detectLanguage(sourceText);
      setDetectedLanguage(result.language);
      setSourceLanguage(result.language);
      
      const lang = commonLanguages.find(l => l.code === result.language);
      toast.success(`Detected language: ${lang?.name || result.language} (${Math.round(result.confidence * 100)}% confidence)`);
    } catch (error) {
      console.error('Language detection failed:', error);
      toast.error('Language detection failed');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') return;
    
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    
    // Swap texts too
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (compact) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Languages className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Quick Translate</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                {commonLanguages.slice(0, 10).map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {commonLanguages.slice(0, 10).map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Enter text to translate..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="min-h-[60px] text-sm"
          />

          <Button 
            onClick={handleTranslate} 
            disabled={isTranslating || !sourceText.trim()}
            size="sm"
            className="w-full"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="w-3 h-3 mr-2" />
                Translate
              </>
            )}
          </Button>

          {translatedText && (
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm">{translatedText}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          AI Translation
          {detectedLanguage && (
            <Badge variant="outline" className="ml-auto">
              Detected: {translationService.formatLanguageDisplay(detectedLanguage)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language Selection */}
        <div className="flex items-center gap-2">
          <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="From language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto-detect</SelectItem>
              {commonLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSwapLanguages}
            disabled={sourceLanguage === 'auto'}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>

          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="To language" />
            </SelectTrigger>
            <SelectContent>
              {commonLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Source Text</label>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDetectLanguage}
                disabled={isDetecting || !sourceText.trim()}
              >
                {isDetecting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  'Detect Language'
                )}
              </Button>
            </div>
          </div>
          
          <Textarea
            placeholder="Enter text to translate..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="min-h-[100px]"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {sourceText.length} characters
            </span>
            <Button 
              onClick={handleTranslate} 
              disabled={isTranslating || !sourceText.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4 mr-2" />
                  Translate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Translation Result */}
        {translatedText && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Translation</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(translatedText)}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm">{translatedText}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onTranslatedText?.(translatedText, targetLanguage)}
              className="w-full"
            >
              Use Translation for Analysis
            </Button>
          </div>
        )}

        {/* Quick Language Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Languages</label>
          <div className="flex flex-wrap gap-1">
            {['hi', 'bn', 'te', 'ta', 'ur', 'ar', 'zh', 'es'].map((langCode) => {
              const lang = commonLanguages.find(l => l.code === langCode);
              return lang ? (
                <Button
                  key={langCode}
                  variant="outline"
                  size="sm"
                  onClick={() => setTargetLanguage(langCode)}
                  className={targetLanguage === langCode ? 'bg-blue-100' : ''}
                >
                  {lang.nativeName}
                </Button>
              ) : null;
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}