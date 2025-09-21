export interface SpeechToTextResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class SpeechToTextService {
  private apiKey: string;
  private recognition: any;
  private isSupported: boolean;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (this.isSupported) {
      try {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        this.isSupported = false;
        this.recognition = null;
      }
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN'; // Indian English
    this.recognition.maxAlternatives = 1;
    // Don't set grammars property as it causes errors
  }

  async startRecording(): Promise<void> {
    if (!this.isSupported) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    if (!this.recognition) {
      throw new Error('Speech recognition not initialized');
    }

    try {
      // Stop any existing recognition first
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore stop errors
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Speech recognition start timeout'));
        }, 5000);

        this.recognition.onstart = () => {
          clearTimeout(timeout);
          resolve();
        };

        this.recognition.onerror = (event: any) => {
          clearTimeout(timeout);
          reject(new Error(`Speech recognition error: ${event.error || 'Unknown error'}`));
        };

        try {
          this.recognition.start();
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });
    } catch (error) {
      throw new Error(`Failed to start recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  stopRecording(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  onResult(callback: (result: SpeechToTextResult) => void): void {
    if (!this.recognition) return;

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        callback({
          transcript,
          confidence: result[0].confidence || 0.8,
          isFinal: result.isFinal
        });
      }
    };
  }

  onEnd(callback: () => void): void {
    if (this.recognition) {
      this.recognition.onend = callback;
    }
  }

  onError(callback: (error: string) => void): void {
    if (this.recognition) {
      this.recognition.onerror = (event: any) => callback(event.error);
    }
  }

  // Alternative method using Google Cloud Speech-to-Text API via backend
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data URL prefix
        };
        reader.readAsDataURL(audioBlob);
      });

      // Get Supabase info
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      // Use backend endpoint for Speech-to-Text
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-76a6fe9f/speech-to-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          audioData: base64Audio,
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'en-IN',
            enableAutomaticPunctuation: true,
            model: 'latest_long'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Speech API error: ${response.status}`);
      }

      const data = await response.json();
      return data.transcript || '';
    } catch (error) {
      console.error('Speech-to-text API error:', error);
      throw error;
    }
  }

  // Record audio and transcribe using Google Cloud API
  async recordAndTranscribe(duration: number = 10000): Promise<string> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Media recording is not supported in this browser');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          try {
            const transcript = await this.transcribeAudio(audioBlob);
            resolve(transcript);
          } catch (error) {
            reject(error);
          }
        };

        mediaRecorder.onerror = (event) => {
          reject(new Error('Recording failed'));
        };

        mediaRecorder.start();
        
        // Stop recording after specified duration
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, duration);
      });
    } catch (error) {
      throw new Error('Failed to access microphone');
    }
  }
}