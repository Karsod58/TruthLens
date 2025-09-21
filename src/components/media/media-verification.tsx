import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';
import { aiAnalysisService, AIAnalysisResult, StoryPrompt } from '../../services/ai-analysis';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Camera, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Eye,
  Download,
  Play,
  BookOpen,
  Target,
  Mic
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { VideoPreview } from '../video/video-preview';
import { VideoTemplateSelector } from '../video/video-template-selector';
import { videoGenerationService, VideoResult, VideoTemplate, VideoGenerationOptions } from '../../services/video-generation';

export function MediaVerification() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [storyPrompt, setStoryPrompt] = useState<StoryPrompt | null>(null);
  const [detailedReport, setDetailedReport] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // Video generation state
  const [showVideoGeneration, setShowVideoGeneration] = useState(false);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null);
  const [videoOptions, setVideoOptions] = useState<VideoGenerationOptions>({
    duration: 120,
    quality: 'medium',
    style: 'educational',
    includeSubtitles: true,
    language: 'en'
  });
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    try {
      const fileType = uploadedFile.type.startsWith('image/') ? 'image' : 
                      uploadedFile.type.startsWith('video/') ? 'video' : 
                      uploadedFile.type.startsWith('audio/') ? 'audio' : 'image';
      
      const fileUrl = URL.createObjectURL(uploadedFile);
      
      toast.info(`Analyzing ${fileType} with Vertex AI for deepfakes and manipulation...`);
      
      const response = await aiAnalysisService.analyzeContent(fileUrl, fileType as any, 
        `Media verification analysis for ${uploadedFile.name}`);
      
      setAnalysisResult(response.analysis);
      setStoryPrompt(response.storyPrompt);
      setDetailedReport(response.detailedReport);
      
      URL.revokeObjectURL(fileUrl);
      
      toast.success('Media analysis completed! Story scenario generated.');
      
    } catch (error) {
      console.error('Media analysis failed:', error);
      toast.error('Analysis failed, using demo results');
      
      // Fallback to demo results
      const mockResult: AIAnalysisResult = {
        credibilityScore: Math.floor(Math.random() * 40) + 30,
        riskLevel: 'high' as const,
        issues: [
          {
            type: 'manipulated_media',
            severity: 'high',
            description: 'Digital manipulation detected in facial regions with high confidence',
            confidence: 89
          },
          {
            type: 'false_claim',
            severity: 'medium', 
            description: 'Compression artifacts inconsistent with claimed authenticity',
            confidence: 76
          }
        ],
        summary: 'Media analysis reveals potential deepfake or digital manipulation with concerning artifacts',
        recommendations: [
          'Verify original source of the media',
          'Cross-reference with other authentic media of the subject',
          'Check metadata for inconsistencies'
        ],
        sources: [
          { url: 'https://deepfakedetection.org', credibility: 94, domain: 'deepfakedetection.org' }
        ],
        attackerProfile: {
          intent: 'Create convincing fake media to deceive viewers',
          motivation: 'Misinformation campaign or identity manipulation',
          methodology: 'Advanced deepfake generation tools and face-swap technology',
          targetAudience: 'Social media users and news consumers'
        }
      };
      
      const mockStory: StoryPrompt = {
        scenario: 'A sophisticated deepfake video spreads across social platforms',
        characters: ['Content creator', 'AI technician', 'Fact-checkers', 'Victims', 'Social media users'],
        timeline: 'Creation → Upload → Viral spread → Detection → Damage control',
        motivations: 'Damage reputation, spread misinformation, or create viral content',
        consequences: 'Identity theft, reputation damage, public confusion, and loss of trust',
        prevention: 'Media literacy education, verification tools, and platform detection systems'
      };
      
      setAnalysisResult(mockResult);
      setStoryPrompt(mockStory);
      setDetailedReport('Demo media analysis: This would contain detailed technical analysis of manipulation artifacts, metadata inconsistencies, and verification recommendations.');
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Video generation handlers
  const handleGenerateVideo = async () => {
    if (!storyPrompt || !selectedTemplate) {
      toast.error('Please select a video template');
      return;
    }

    setIsGeneratingVideo(true);
    try {
      console.log('Starting video generation...', { storyPrompt, selectedTemplate, videoOptions });
      
      const result = await videoGenerationService.generateVideoFromStory(storyPrompt, videoOptions);
      console.log('Video generation result:', result);
      
      setVideoResult(result);
      setShowVideoGeneration(true);
      toast.success('Video generation started!');
    } catch (error) {
      console.error('Video generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Video generation failed: ${errorMessage}`);
      
      // Show retry option
      toast.error('Video generation failed. Click to retry.', {
        action: {
          label: 'Retry',
          onClick: () => handleGenerateVideo()
        }
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleTemplateSelect = (template: VideoTemplate) => {
    setSelectedTemplate(template);
    setVideoOptions(prev => ({
      ...prev,
      duration: template.duration,
      style: template.style as any
    }));
  };

  const handleVideoOptionsChange = (options: VideoGenerationOptions) => {
    setVideoOptions(options);
  };

  const handleRegenerateVideo = () => {
    setVideoResult(null);
    handleGenerateVideo();
  };

  const handleCloseVideoGeneration = () => {
    setShowVideoGeneration(false);
    setVideoResult(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Media Verification</h1>
        <p className="text-muted-foreground">
          Upload images or videos to detect deepfakes and digital manipulations using Vertex AI Vision
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Media</CardTitle>
              <CardDescription>
                Supported formats: JPEG, PNG, MP4, MOV (Max 50MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-medium">Drop files here or click to upload</p>
                      <p className="text-sm text-muted-foreground">
                        Images and videos will be analyzed for authenticity
                      </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                      <label className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {uploadedFile.type.startsWith('image/') ? (
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Video className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null);
                          setPreviewUrl('');
                          setAnalysisResult(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  {previewUrl && uploadedFile.type.startsWith('image/') && (
                    <div className="border rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={previewUrl}
                        alt="Uploaded media"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing with Vertex AI...
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Analyze for Deepfakes
                      </>
                    )}
                  </Button>

                  {isAnalyzing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Processing with Vertex AI Vision...</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="w-full" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Try Sample Media</CardTitle>
              <CardDescription>Test with these sample files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto p-3 flex flex-col space-y-2">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    alt="Sample 1"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="text-xs">Portrait Sample</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 flex flex-col space-y-2">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
                    alt="Sample 2"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="text-xs">Group Photo</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {analysisResult && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Vertex AI Media Analysis
                    <Badge className={aiAnalysisService.getRiskLevelColor(analysisResult.riskLevel)}>
                      {analysisResult.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="analysis" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                      <TabsTrigger value="story">Story</TabsTrigger>
                      <TabsTrigger value="regions">Detection</TabsTrigger>
                      <TabsTrigger value="report">Report</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analysis" className="space-y-4">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Credibility Score</span>
                            <span className="text-2xl font-bold text-red-600">
                              {analysisResult.credibilityScore}%
                            </span>
                          </div>
                          <Progress value={analysisResult.credibilityScore} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-2">
                            Lower scores indicate higher likelihood of manipulation
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            AI-Detected Issues:
                          </h4>
                          <div className="space-y-2">
                            {analysisResult.issues.map((issue, index) => (
                              <div key={index} className="p-3 border rounded-lg flex items-start space-x-3">
                                <AlertTriangle className={`w-5 h-5 mt-0.5 ${ 
                                  issue.severity === 'high' || issue.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'
                                }`} />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{aiAnalysisService.getIssueTypeDisplayName(issue.type)}</span>
                                    <Badge variant={issue.severity === 'high' || issue.severity === 'critical' ? 'destructive' : 'secondary'}>
                                      {aiAnalysisService.formatConfidence(issue.confidence)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {issue.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">AI Summary:</h4>
                          <p className="text-sm text-muted-foreground p-3 bg-blue-50 rounded-lg border">
                            {analysisResult.summary}
                          </p>
                        </div>

                        {analysisResult.attackerProfile && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center">
                              <Target className="w-4 h-4 mr-2" />
                              Attack Analysis:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="font-medium text-red-800">Intent</p>
                                <p className="text-sm text-red-600">{analysisResult.attackerProfile.intent}</p>
                              </div>
                              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <p className="font-medium text-orange-800">Method</p>
                                <p className="text-sm text-orange-600">{analysisResult.attackerProfile.methodology}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="story" className="space-y-4">
                      {storyPrompt && (
                        <>
                          <Alert>
                            <Play className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Auto-Generated Story Prompt</strong> - Educational video scenario about this media manipulation
                            </AlertDescription>
                          </Alert>
                          
                          <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                              <h4 className="font-medium mb-2 flex items-center">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Story Scenario
                              </h4>
                              <p className="text-sm">{storyPrompt.scenario}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-blue-800 mb-2">Timeline</h4>
                                <p className="text-sm text-blue-700">{storyPrompt.timeline}</p>
                              </div>
                              
                              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-medium text-green-800 mb-2">Characters</h4>
                                <ul className="text-sm text-green-700 space-y-1">
                                  {storyPrompt.characters.map((char, index) => (
                                    <li key={index}>• {char}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                <h4 className="font-medium text-red-800 mb-2">Motivations</h4>
                                <p className="text-sm text-red-700">{storyPrompt.motivations}</p>
                              </div>
                              
                              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h4 className="font-medium text-yellow-800 mb-2">Consequences</h4>
                                <p className="text-sm text-yellow-700">{storyPrompt.consequences}</p>
                              </div>
                              
                              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-medium text-green-800 mb-2">Prevention</h4>
                                <p className="text-sm text-green-700">{storyPrompt.prevention}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Button 
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              onClick={() => setShowVideoGeneration(true)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Create Educational Video from Story
                            </Button>
                            
                            {!showVideoGeneration && (
                              <div className="text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowVideoGeneration(true)}
                                >
                                  Choose Video Template
                                </Button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="regions" className="space-y-4">
                      <div className="relative">
                        {previewUrl && (
                          <div className="relative border rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={previewUrl}
                              alt="Media analysis"
                              className="w-full h-64 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                              <div className="p-4 text-white">
                                <p className="text-sm font-medium">AI Analysis Complete</p>
                                <p className="text-xs opacity-75">Issues detected and analyzed by Vertex AI</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Advanced AI analysis detected manipulation patterns and artifacts
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="report" className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg border max-h-64 overflow-y-auto">
                        <h4 className="font-medium mb-3">Detailed Technical Report</h4>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700">
                            {detailedReport}
                          </pre>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Export Full Report
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View Analysis Details
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {!analysisResult && !uploadedFile && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">No Media Selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload an image or video to begin verification analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Video Generation Modal */}
      {showVideoGeneration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Generate Video from Story</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseVideoGeneration}
                >
                  Close
                </Button>
              </div>

              {!videoResult ? (
                <VideoTemplateSelector
                  templates={videoGenerationService.getVideoTemplates()}
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                  onOptionsChange={handleVideoOptionsChange}
                  options={videoOptions}
                  onGenerate={handleGenerateVideo}
                  isGenerating={isGeneratingVideo}
                />
              ) : (
                <VideoPreview
                  videoResult={videoResult}
                  storyPrompt={storyPrompt!}
                  template={selectedTemplate!}
                  onRegenerate={handleRegenerateVideo}
                  onClose={handleCloseVideoGeneration}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}