import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Mic, MicOff, Volume2, Loader2, AlertCircle } from 'lucide-react';
import { SpeechToTextService, SpeechToTextResult } from '../../services/speech-to-text';
import { translationService } from '../../services/translation';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscriptUpdate: (transcript: string) => void;
  onAnalyze: (text: string) => void;
  isAnalyzing?: boolean;
}

export function VoiceInput({ onTranscriptUpdate, onAnalyze, isAnalyzing }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [language, setLanguage] = useState<string>('en-IN');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  
  const speechService = useRef<SpeechToTextService | null>(null);
  const recordingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check microphone permissions first
    const checkPermissions = async () => {
      try {
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          if (permission.state === 'denied') {
            setError('Microphone access denied. Please enable microphone permissions.');
          }
        }
      } catch (error) {
        console.log('Permission check not supported');
      }
    };

    const initializeService = async () => {
      try {
        await checkPermissions();

        // Check browser compatibility first
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
          return;
        }

        // Initialize speech service with API key
        speechService.current = new SpeechToTextService(import.meta.env.VITE_GOOGLE_CLOUD_API_KEY || '');
        
        if (speechService.current) {
          speechService.current.onResult((result: SpeechToTextResult) => {
            if (result.isFinal) {
              const newTranscript = transcript + result.transcript + ' ';
              setTranscript(newTranscript);
              setInterimTranscript('');
              setConfidence(result.confidence);
              onTranscriptUpdate(newTranscript);
              
              // Auto-detect language for final transcript
              if (result.transcript.length > 10) {
                detectTranscriptLanguage(result.transcript);
              }
            } else {
              setInterimTranscript(result.transcript);
            }
          });

          speechService.current.onEnd(() => {
            setIsRecording(false);
            if (recordingTimeout.current) {
              clearTimeout(recordingTimeout.current);
            }
          });

          speechService.current.onError((error: string) => {
            console.error('Speech recognition error:', error);
            setError(`Speech recognition error: ${error}`);
            setIsRecording(false);
            toast.error(`Speech recognition failed: ${error}`);
          });
        }
      } catch (error) {
        console.error('Failed to initialize speech service:', error);
        setError('Failed to initialize speech recognition');
      }
    };

    initializeService();

    return () => {
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
      }
      if (speechService.current) {
        try {
          speechService.current.stopRecording();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      
      // Request microphone permission explicitly
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      } catch (permError) {
        setError('Microphone access denied. Please allow microphone access and try again.');
        toast.error('Please allow microphone access');
        return;
      }
      
      setIsRecording(true);
      
      if (speechService.current) {
        await speechService.current.startRecording();
        toast.success('Voice recording started - speak clearly!');
        
        // Auto-stop after 30 seconds
        recordingTimeout.current = setTimeout(() => {
          stopRecording();
        }, 30000);
      }
    } catch (error) {
      console.error('Recording start error:', error);
      setError(`Failed to start recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsRecording(false);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (speechService.current) {
      speechService.current.stopRecording();
    }
    setIsRecording(false);
    
    if (recordingTimeout.current) {
      clearTimeout(recordingTimeout.current);
    }
    
    toast.success('Voice recording stopped');
  };

  const handleRecordAndAnalyze = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      if (speechService.current) {
        toast.info('Recording for 10 seconds...');
        const transcript = await speechService.current.recordAndTranscribe(10000);
        
        if (transcript.trim()) {
          setTranscript(transcript);
          onTranscriptUpdate(transcript);
          onAnalyze(transcript);
          toast.success('Voice analysis started!');
        } else {
          toast.error('No speech detected. Please try again.');
        }
      }
    } catch (error) {
      setError('Failed to process voice input');
      toast.error('Voice processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
    onTranscriptUpdate('');
  };

  const detectTranscriptLanguage = async (text: string) => {
    try {
      const result = await translationService.detectLanguage(text);
      setDetectedLanguage(result.language);
      
      const langName = translationService.getCommonLanguages()
        .find(l => l.code === result.language)?.name || result.language;
      
      if (result.confidence > 0.7) {
        toast.info(`Language detected: ${langName} (${Math.round(result.confidence * 100)}% confidence)`);
      }
    } catch (error) {
      console.error('Language detection failed:', error);
    }
  };

  const analyzeCurrentTranscript = () => {
    if (transcript.trim()) {
      onAnalyze(transcript.trim());
      toast.success('Analyzing voice input...');
    } else {
      toast.error('No text to analyze');
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Voice Input</h3>
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              Recording
            </Badge>
          )}
          {confidence > 0 && (
            <Badge variant="secondary">
              {Math.round(confidence * 100)}% confidence
            </Badge>
          )}
          {detectedLanguage && (
            <Badge variant="outline" className="text-xs">
              {translationService.getCommonLanguages().find(l => l.code === detectedLanguage)?.name || detectedLanguage}
            </Badge>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <div className="text-sm text-red-700">
            <p>{error}</p>
            {error.includes('not supported') && (
              <p className="mt-1 text-xs">
                Try using Chrome, Edge, or Safari for voice input support.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* Voice Controls */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isAnalyzing}
            variant={isRecording ? "destructive" : "default"}
            size="sm"
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </>
            )}
          </Button>

          <Button
            onClick={handleRecordAndAnalyze}
            disabled={isRecording || isProcessing || isAnalyzing}
            variant="outline"
            size="sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Quick Analyze (10s)
              </>
            )}
          </Button>
        </div>

        {/* Transcript Display */}
        {(transcript || interimTranscript) && (
          <div className="space-y-2">
            <div className="bg-gray-50 border rounded-lg p-3 min-h-[80px]">
              <p className="text-sm">
                <span className="text-gray-900">{transcript}</span>
                <span className="text-gray-500 italic">{interimTranscript}</span>
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={analyzeCurrentTranscript}
                disabled={!transcript.trim() || isAnalyzing}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Voice Input'
                )}
              </Button>
              
              <Button
                onClick={clearTranscript}
                variant="outline"
                size="sm"
                disabled={isRecording || isProcessing}
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Click "Start Recording" for continuous voice input</p>
          <p>• Use "Quick Analyze" for 10-second voice analysis</p>
          <p>• Supports multiple languages with auto-detection</p>
          <p>• Speak clearly for best recognition accuracy</p>
        </div>
      </div>
    </Card>
  );
}