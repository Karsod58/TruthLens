import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Settings, 
  Maximize, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  FileVideo,
  ExternalLink
} from 'lucide-react';
import { VideoResult, VideoTemplate } from '../../services/video-generation';
import { StoryPrompt } from '../../services/ai-analysis';
import { toast } from 'sonner';

interface VideoPreviewProps {
  videoResult: VideoResult;
  storyPrompt: StoryPrompt;
  template: VideoTemplate;
  onRegenerate?: () => void;
  onClose?: () => void;
}

export function VideoPreview({ videoResult, storyPrompt, template, onRegenerate, onClose }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(videoResult.duration);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Handle video play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Export video
  const handleExport = async (format: 'mp4' | 'webm' | 'mov') => {
    setIsExporting(true);
    try {
      // In production, this would call the actual export service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export
      toast.success(`Video exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // Share video
  const handleShare = async (platform: 'youtube' | 'twitter' | 'facebook' | 'linkedin') => {
    setIsSharing(true);
    try {
      // In production, this would call the actual share service
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate sharing
      toast.success(`Video shared to ${platform}`);
    } catch (error) {
      toast.error('Share failed');
    } finally {
      setIsSharing(false);
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    switch (videoResult.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Ready</Badge>;
      case 'generating':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Generating</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Video Player */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileVideo className="w-5 h-5" />
              Generated Video
              {getStatusBadge()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onRegenerate}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {videoResult.status === 'generating' && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Generating video...</span>
                <span>{videoResult.progress}%</span>
              </div>
              <Progress value={videoResult.progress} className="w-full" />
              <div className="mt-2 text-xs text-gray-500">
                {videoResult.progress < 25 && "Initializing video generation..."}
                {videoResult.progress >= 25 && videoResult.progress < 50 && "Processing story content..."}
                {videoResult.progress >= 50 && videoResult.progress < 75 && "Generating video scenes..."}
                {videoResult.progress >= 75 && videoResult.progress < 90 && "Adding audio and effects..."}
                {videoResult.progress >= 90 && videoResult.progress < 100 && "Finalizing video..."}
                {videoResult.progress === 100 && "Video generation complete!"}
              </div>
            </div>
          )}

          {videoResult.status === 'failed' && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Video generation failed: {videoResult.error || 'Unknown error'}
              </AlertDescription>
            </Alert>
          )}

          {videoResult.status === 'completed' && (
            <div className="space-y-4">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 md:h-96 object-cover"
                  poster={videoResult.thumbnailUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnd}
                  onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                >
                  <source src={videoResult.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <div 
                    ref={progressRef}
                    className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>

                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                        />
                      </div>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="text-white hover:bg-white/20"
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Duration:</span>
                  <span className="ml-2">{formatTime(duration)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Size:</span>
                  <span className="ml-2">{(videoResult.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Template:</span>
                  <span className="ml-2">{template.name}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Story Prompt Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Video Story Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Scenario</h4>
            <p className="text-sm text-gray-600">{storyPrompt.scenario}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Characters</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {storyPrompt.characters.map((char, index) => (
                  <li key={index}>• {char}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
              <p className="text-sm text-gray-600">{storyPrompt.timeline}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Key Messages</h4>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-red-800">Motivations:</span>
                <p className="text-sm text-gray-600">{storyPrompt.motivations}</p>
              </div>
              <div>
                <span className="font-medium text-orange-800">Consequences:</span>
                <p className="text-sm text-gray-600">{storyPrompt.consequences}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Prevention:</span>
                <p className="text-sm text-gray-600">{storyPrompt.prevention}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {videoResult.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export & Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Export Options */}
              <div className="space-y-3">
                <h4 className="font-medium">Export Video</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('mp4')}
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    MP4
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('webm')}
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    WebM
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('mov')}
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    MOV
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <h4 className="font-medium">Share Video</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('youtube')}
                    disabled={isSharing}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    YouTube
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    disabled={isSharing}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                    disabled={isSharing}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
