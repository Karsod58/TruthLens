import React, { useState } from 'react';
// Mock useParams for demo
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Share2, 
  Download, 
  Flag,
  Clock,
  Globe,
  User,
  BookOpen
} from 'lucide-react';
import { TruthScoreMeter } from '../dashboard/truth-score-meter';

export function DetailedResult() {
  const id = 'demo-analysis-123';
  const [activeTab, setActiveTab] = useState('analysis');

  // Mock detailed analysis data
  const analysisData = {
    id: id || 'latest',
    title: 'COVID-19 vaccine effectiveness study claims',
    content: 'Recent study shows 95% effectiveness rate for COVID-19 vaccines with new variant protection...',
    truthScore: 32,
    confidence: 87,
    timestamp: '2024-01-15T10:30:00Z',
    source: 'https://example-news-site.com/article/123',
    categories: [
      {
        category: 'Misleading Statistics',
        severity: 'high',
        confidence: 91,
        explanation: 'The cited statistics appear to be taken out of context and misrepresent the original study findings.',
        evidence: ['Incomplete data presentation', 'Missing control group information', 'Selective citation']
      },
      {
        category: 'Unverified Claims',
        severity: 'high',
        confidence: 85,
        explanation: 'Several claims lack proper scientific backing or peer review.',
        evidence: ['No peer-reviewed sources', 'Anecdotal evidence only', 'Contradicts established research']
      },
      {
        category: 'Emotional Language',
        severity: 'medium',
        confidence: 78,
        explanation: 'Content uses emotionally charged language to influence opinion rather than inform.',
        evidence: ['Sensationalized headlines', 'Fear-inducing terminology', 'Biased framing']
      }
    ],
    recommendations: [
      'Verify claims with peer-reviewed sources',
      'Cross-reference with official health authorities',
      'Look for balanced reporting from multiple sources',
      'Check author credentials and publication standards'
    ],
    technicalDetails: {
      aiModels: ['Vertex AI Text Analysis', 'Natural Language API', 'Gemini Pro'],
      processingTime: '2.3 seconds',
      confidenceFactors: [
        'Linguistic patterns analysis',
        'Source credibility assessment', 
        'Fact-checking database comparison',
        'Statistical claim verification'
      ]
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{analysisData.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(analysisData.timestamp).toLocaleString()}
            </span>
            <span className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              Web Article
            </span>
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              AI Analysis
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Flag className="w-4 h-4 mr-2" />
            Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content Analysis</CardTitle>
                  <CardDescription>
                    AI-powered analysis of the content for misinformation indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm">{analysisData.content}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Key Findings:</h4>
                    {analysisData.categories.map((category, index) => (
                      <div key={index} className={`p-3 border rounded-lg ${getSeverityColor(category.severity)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{category.category}</h5>
                          <Badge variant="outline">
                            {category.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{category.explanation}</p>
                        <div className="text-xs">
                          <strong>Evidence:</strong> {category.evidence.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisData.categories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-sm text-muted-foreground">
                          {category.confidence}% confidence
                        </span>
                      </div>
                      <Progress value={category.confidence} className="h-2" />
                      <div className="pl-4 border-l-2 border-gray-200">
                        <p className="text-sm text-muted-foreground mb-2">
                          {category.explanation}
                        </p>
                        <ul className="text-xs space-y-1">
                          {category.evidence.map((evidence, i) => (
                            <li key={i} className="flex items-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Evidence</CardTitle>
                  <CardDescription>
                    Fact-checking sources and verification data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="font-medium">Contradictory Sources Found</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Multiple authoritative sources contradict the main claims in this content.
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">Missing Context</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Important contextual information has been omitted or misrepresented.
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Fact-Check References</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Snopes.com - Fact-check database</li>
                        <li>• PolitiFact - Political claims verification</li>
                        <li>• Reuters Fact Check - News verification</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                  <CardDescription>
                    AI models and processing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">AI Models Used</h4>
                      <ul className="text-sm space-y-1">
                        {analysisData.technicalDetails.aiModels.map((model, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                            {model}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Processing Metrics</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Processing Time:</span>
                          <span>{analysisData.technicalDetails.processingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Confidence Level:</span>
                          <span>{analysisData.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Analysis Factors</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {analysisData.technicalDetails.confidenceFactors.map((factor, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <TruthScoreMeter score={analysisData.truthScore} confidence={analysisData.confidence} />
          
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisData.recommendations.map((rec, index) => (
                <div key={index} className="text-sm p-2 border-l-3 border-blue-500 bg-blue-50">
                  {rec}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <strong>URL:</strong>
                <p className="text-muted-foreground break-all">{analysisData.source}</p>
              </div>
              <div>
                <strong>Analysis ID:</strong>
                <p className="text-muted-foreground">{analysisData.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}