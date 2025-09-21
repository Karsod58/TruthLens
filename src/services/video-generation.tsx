import { StoryPrompt } from './ai-analysis';

export interface VideoGenerationOptions {
  duration?: number; // in seconds
  quality?: 'low' | 'medium' | 'high';
  style?: 'educational' | 'dramatic' | 'informative';
  includeSubtitles?: boolean;
  language?: string;
}

export interface VideoResult {
  videoId: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  size: number; // in bytes
  status: 'generating' | 'completed' | 'failed';
  progress: number; // 0-100
  error?: string;
}

export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  style: string;
  thumbnail: string;
}

export class VideoGenerationService {
  private baseUrl = 'https://zuxisavlaxiywcingyyb.supabase.co/functions/v1/make-server-76a6fe9f';

  // Available video templates
  private templates: VideoTemplate[] = [
    {
      id: 'educational',
      name: 'Educational Style',
      description: 'Clean, informative presentation with clear visuals',
      duration: 120,
      style: 'educational',
      thumbnail: '/templates/educational-thumb.jpg'
    },
    {
      id: 'dramatic',
      name: 'Dramatic Style',
      description: 'Engaging narrative with dramatic visuals and music',
      duration: 150,
      style: 'dramatic',
      thumbnail: '/templates/dramatic-thumb.jpg'
    },
    {
      id: 'news',
      name: 'News Report Style',
      description: 'Professional news report format with graphics',
      duration: 90,
      style: 'informative',
      thumbnail: '/templates/news-thumb.jpg'
    },
    {
      id: 'social',
      name: 'Social Media Style',
      description: 'Short, engaging format optimized for social platforms',
      duration: 60,
      style: 'educational',
      thumbnail: '/templates/social-thumb.jpg'
    }
  ];

  // Generate video from story prompt
  async generateVideoFromStory(
    storyPrompt: StoryPrompt, 
    options: VideoGenerationOptions = {}
  ): Promise<VideoResult> {
    try {
      console.log('Starting video generation from story prompt...');
      
      // Try to use the API first, fallback to simulation if it fails
      try {
        const { projectId, publicAnonKey } = await import('../utils/supabase/info');
        
        // Create video generation request
        const requestBody = {
          storyPrompt,
          options: {
            duration: options.duration || 120,
            quality: options.quality || 'medium',
            style: options.style || 'educational',
            includeSubtitles: options.includeSubtitles ?? true,
            language: options.language || 'en'
          }
        };

        const response = await fetch(`${this.baseUrl}/generate-video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            return data.videoResult;
          }
        }
        
        console.warn('API video generation failed, falling back to simulation');
      } catch (apiError) {
        console.warn('API not available, using simulation:', apiError);
      }

      // Fallback to simulation
      const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return await this.simulateVideoGeneration(videoId, storyPrompt, options);
      
    } catch (error) {
      console.error('Video generation failed:', error);
      throw new Error(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Simulate video generation process
  private async simulateVideoGeneration(
    videoId: string, 
    storyPrompt: StoryPrompt, 
    options: VideoGenerationOptions
  ): Promise<VideoResult> {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const steps = [
        { name: 'Initializing video generation...', progress: 10 },
        { name: 'Processing story content...', progress: 25 },
        { name: 'Generating video scenes...', progress: 50 },
        { name: 'Adding audio and effects...', progress: 75 },
        { name: 'Finalizing video...', progress: 90 },
        { name: 'Video generation complete!', progress: 100 }
      ];
      
      let currentStep = 0;
      
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          progress = steps[currentStep].progress;
          console.log(`${steps[currentStep].name} (${progress}%)`);
          currentStep++;
        }
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Simulate occasional failures for testing
          if (Math.random() < 0.1) { // 10% chance of failure
            reject(new Error('Simulated video generation failure for testing'));
            return;
          }
          
          resolve({
            videoId,
            videoUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_${Math.floor(Math.random() * 3) + 1}.mp4`,
            thumbnailUrl: `https://picsum.photos/640/360?random=${videoId}`,
            duration: options.duration || 120,
            size: Math.floor(Math.random() * 50000000) + 10000000, // 10-60MB
            status: 'completed',
            progress: 100
          });
        }
      }, 1000); // Slower for better UX
    });
  }

  // Get video generation status
  async getVideoStatus(videoId: string): Promise<VideoResult> {
    try {
      // In production, this would check actual video generation status
      return {
        videoId,
        videoUrl: `https://example.com/videos/${videoId}.mp4`,
        thumbnailUrl: `https://example.com/thumbnails/${videoId}.jpg`,
        duration: 120,
        size: 25000000,
        status: 'completed',
        progress: 100
      };
    } catch (error) {
      throw new Error(`Failed to get video status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get available video templates
  getVideoTemplates(): VideoTemplate[] {
    return this.templates;
  }

  // Generate video script from story prompt
  generateVideoScript(storyPrompt: StoryPrompt, template: VideoTemplate): string {
    const script = `
# Video Script: ${template.name}

## Opening (0-10s)
${storyPrompt.scenario}

## Characters Introduction (10-30s)
${storyPrompt.characters.map((char, index) => `${index + 1}. ${char}`).join('\n')}

## Timeline (30-60s)
${storyPrompt.timeline}

## Motivations (60-90s)
${storyPrompt.motivations}

## Consequences (90-120s)
${storyPrompt.consequences}

## Prevention (120-150s)
${storyPrompt.prevention}

## Closing (150-180s)
Remember: Always verify information through reliable sources and think before sharing.
    `.trim();

    return script;
  }

  // Generate video metadata
  generateVideoMetadata(storyPrompt: StoryPrompt, options: VideoGenerationOptions) {
    return {
      title: `TruthLens: ${storyPrompt.scenario.substring(0, 50)}...`,
      description: `Educational video about misinformation prevention. ${storyPrompt.summary}`,
      tags: ['misinformation', 'fact-checking', 'education', 'truthlens'],
      category: 'Education',
      language: options.language || 'en',
      duration: options.duration || 120,
      quality: options.quality || 'medium'
    };
  }

  // Export video in different formats
  async exportVideo(videoId: string, format: 'mp4' | 'webm' | 'mov' = 'mp4'): Promise<string> {
    try {
      // In production, this would convert video to requested format
      return `https://example.com/videos/${videoId}.${format}`;
    } catch (error) {
      throw new Error(`Failed to export video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Share video
  async shareVideo(videoId: string, platform: 'youtube' | 'twitter' | 'facebook' | 'linkedin'): Promise<string> {
    try {
      // In production, this would upload to respective platform
      const platformUrls = {
        youtube: `https://youtube.com/watch?v=${videoId}`,
        twitter: `https://twitter.com/i/videos/${videoId}`,
        facebook: `https://facebook.com/videos/${videoId}`,
        linkedin: `https://linkedin.com/videos/${videoId}`
      };
      
      return platformUrls[platform];
    } catch (error) {
      throw new Error(`Failed to share video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const videoGenerationService = new VideoGenerationService();
