import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';
import { aiAnalysisService, AIAnalysisResult, StoryPrompt } from '../../services/ai-analysis';
import { 
  Upload, 
  Link, 
  FileText, 
  Image, 
  Video, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Activity,
  Shield,
  Play,
  BookOpen,
  Target,
  Users,
  Clock,
  Eye
} from 'lucide-react';
import { TruthScoreMeter } from './truth-score-meter';
import { RecentAnalyses } from './recent-analyses';
import { VoiceInput } from './voice-input';
import { TranslationWidget } from './translation-widget';
import { VideoPreview } from '../video/video-preview';
import { VideoTemplateSelector } from '../video/video-template-selector';
import { videoGenerationService, VideoResult, VideoTemplate, VideoGenerationOptions } from '../../services/video-generation';

export function Dashboard() {
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [storyPrompt, setStoryPrompt] = useState<StoryPrompt | null>(null);
  const [detailedReport, setDetailedReport] = useState<string>('');
  const [analysisId, setAnalysisId] = useState<string>('');
  
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

  const handleAnalyze = async (content?: string) => {
    const textToAnalyze = content || inputText || inputUrl;
    if (!textToAnalyze) return;
    
    setIsAnalyzing(true);
    
    try {
      const contentType = inputUrl ? 'text' : 'text'; // URL is treated as text for analysis
      const context = inputUrl ? `URL analysis for: ${inputUrl}` : content ? 'Voice input analysis' : undefined;
      
      toast.info('Starting AI analysis with Google Cloud APIs...');
      
      const response = await aiAnalysisService.analyzeContent(textToAnalyze, contentType, context);
      
      setAnalysisResult(response.analysis);
      setStoryPrompt(response.storyPrompt);
      setDetailedReport(response.detailedReport);
      setAnalysisId(response.analysisId);
      
      toast.success('Analysis completed! Story prompt generated automatically.');
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
      
      // Fallback to demo data
      const mockResult: AIAnalysisResult = {
        credibilityScore: Math.floor(Math.random() * 40) + 20,
        riskLevel: 'high' as const,
        issues: [
          { 
            type: 'misleading_information', 
            severity: 'high', 
            description: 'Content contains unverified claims that could mislead readers',
            confidence: 85 
          },
          { 
            type: 'bias', 
            severity: 'medium', 
            description: 'Biased language detected that may influence reader opinion',
            confidence: 72 
          }
        ],
        summary: 'AI analysis detected potential misinformation with high confidence. Multiple verification issues found.',
        recommendations: [
          'Cross-reference claims with authoritative sources',
          'Check for similar content on fact-checking websites',
          'Verify the credibility of the original source'
        ],
        sources: [
          { url: 'https://factcheck.org', credibility: 95, domain: 'factcheck.org' },
          { url: 'https://snopes.com', credibility: 92, domain: 'snopes.com' }
        ],
        attackerProfile: {
          intent: 'Spread misleading information to influence public opinion',
          motivation: 'Political or ideological agenda',
          methodology: 'Social media manipulation and selective fact presentation',
          targetAudience: 'General public, particularly politically engaged users'
        }
      };
      
      const mockStory: StoryPrompt = {
        scenario: 'A misleading news article spreads rapidly across social media platforms',
        characters: ['Original poster', 'Influencers', 'General public', 'Fact-checkers'],
        timeline: 'Content posted → Viral spread → Fact-check → Correction attempts',
        motivations: 'Political agenda to sway public opinion before elections',
        consequences: 'Public confusion, polarization, and erosion of trust in media',
        prevention: 'Critical thinking, source verification, and fact-checking habits'
      };
      
      setAnalysisResult(mockResult);
      setStoryPrompt(mockStory);
      setDetailedReport('Demo analysis completed. In production, this would contain a comprehensive report generated by Google Cloud APIs.');
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceTranscriptUpdate = (transcript: string) => {
    setInputText(transcript);
  };

  const handleTranslatedText = (translatedText: string, language: string) => {
    setInputText(translatedText);
    toast.success(`Text translated to ${language} and added to analysis`);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 
                      file.type.startsWith('audio/') ? 'audio' : 'text';
      
      // Create a URL for the file for analysis
      const fileUrl = URL.createObjectURL(file);
      
      setIsAnalyzing(true);
      toast.info(`Analyzing ${fileType} file with Vertex AI...`);
      
      try {
        const response = await aiAnalysisService.analyzeContent(fileUrl, fileType as any);
        
        setAnalysisResult(response.analysis);
        setStoryPrompt(response.storyPrompt);
        setDetailedReport(response.detailedReport);
        setAnalysisId(response.analysisId);
        
        toast.success('File analysis completed with story generation!');
      } catch (error) {
        console.error('File analysis failed:', error);
        toast.error('File analysis failed. Please try again.');
      } finally {
        setIsAnalyzing(false);
        URL.revokeObjectURL(fileUrl);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Analyses Today</p>
                <p className="text-2xl font-semibold">247</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                <p className="text-2xl font-semibold">94.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threats Detected</p>
                <p className="text-2xl font-semibold">18</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Status</p>
                <p className="text-2xl font-semibold">Online</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Input */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
              <CardDescription>
                Paste text, upload files, or enter a URL to analyze for misinformation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Text Content</label>
                <Textarea
                  placeholder="Paste the content you want to analyze for misinformation..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium mb-2">URL Analysis</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="https://example.com/article"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Link className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">File Upload</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="relative overflow-hidden">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FileText className="w-4 h-4 mr-2" />
                    Document
                  </Button>
                  <Button variant="outline" className="relative overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Image className="w-4 h-4 mr-2" />
                    Image
                  </Button>
                  <Button variant="outline" className="relative overflow-hidden">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                </div>
              </div>

              <Button 
                onClick={() => handleAnalyze()}
                disabled={(!inputText && !inputUrl) || isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing with Google Cloud APIs...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Analyze Content
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Processing with Google Cloud APIs...</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Input Card */}
          <VoiceInput 
            onTranscriptUpdate={handleVoiceTranscriptUpdate}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />

          {/* Translation Widget */}
          <TranslationWidget 
            initialText={inputText}
            onTranslatedText={handleTranslatedText}
            compact={false}
          />

          {/* Analysis Results */}
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Google Cloud AI Analysis Results
                  <Badge className={aiAnalysisService.getRiskLevelColor(analysisResult.riskLevel)}>
                    {analysisResult.riskLevel.toUpperCase()} RISK
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="story">Story Prompt</TabsTrigger>
                    <TabsTrigger value="report">Full Report</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="analysis" className="space-y-4">
                    <TruthScoreMeter score={analysisResult.credibilityScore} confidence={85} />
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Issues Detected by AI:
                      </h4>
                      <div className="space-y-2">
                        {analysisResult.issues.map((issue, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-2">
                              {issue.severity === 'high' || issue.severity === 'critical' ? (
                                <XCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              )}
                              <div>
                                <p className="font-medium">{aiAnalysisService.getIssueTypeDisplayName(issue.type)}</p>
                                <p className="text-sm text-muted-foreground">{issue.description}</p>
                              </div>
                            </div>
                            <Badge variant={issue.severity === 'high' || issue.severity === 'critical' ? 'destructive' : 'secondary'}>
                              {aiAnalysisService.formatConfidence(issue.confidence)}
                            </Badge>
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

                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {analysisResult.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {analysisResult.attackerProfile && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          Attacker Profile Analysis:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="font-medium text-red-800">Intent</p>
                            <p className="text-sm text-red-600">{analysisResult.attackerProfile.intent}</p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <p className="font-medium text-orange-800">Motivation</p>
                            <p className="text-sm text-orange-600">{analysisResult.attackerProfile.motivation}</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="font-medium text-purple-800">Methodology</p>
                            <p className="text-sm text-purple-600">{analysisResult.attackerProfile.methodology}</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="font-medium text-blue-800">Target Audience</p>
                            <p className="text-sm text-blue-600">{analysisResult.attackerProfile.targetAudience}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="story" className="space-y-4">
                    {storyPrompt && (
                      <>
                        <Alert>
                          <Play className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Auto-Generated Story Video Prompt</strong> - Ready for video production
                          </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                            <h4 className="font-medium mb-2 flex items-center">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Scenario
                            </h4>
                            <p className="text-sm">{storyPrompt.scenario}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                Characters
                              </h4>
                              <ul className="text-sm text-green-700 space-y-1">
                                {storyPrompt.characters.map((char, index) => (
                                  <li key={index}>• {char}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                              <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Timeline
                              </h4>
                              <p className="text-sm text-yellow-700">{storyPrompt.timeline}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                              <h4 className="font-medium text-red-800 mb-2">Motivations</h4>
                              <p className="text-sm text-red-700">{storyPrompt.motivations}</p>
                            </div>
                            
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                              <h4 className="font-medium text-orange-800 mb-2">Consequences</h4>
                              <p className="text-sm text-orange-700">{storyPrompt.consequences}</p>
                            </div>
                            
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-medium text-blue-800 mb-2">Prevention</h4>
                              <p className="text-sm text-blue-700">{storyPrompt.prevention}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => setShowVideoGeneration(true)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Generate Video from Story Prompt
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
                  
                  <TabsContent value="report" className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto">
                      <h4 className="font-medium mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Comprehensive Analysis Report
                      </h4>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">
                          {detailedReport}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Report
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Export PDF
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Analyses Sidebar */}
        <div>
          <RecentAnalyses />
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