import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface AIAnalysisResult {
  credibilityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issues: Array<{
    type: string;
    severity: string;
    description: string;
    confidence: number;
  }>;
  summary: string;
  recommendations: string[];
  sources: Array<{
    url: string;
    credibility: number;
    domain: string;
  }>;
  attackerProfile?: {
    intent: string;
    motivation: string;
    methodology: string;
    targetAudience: string;
  };
}

export interface StoryPrompt {
  scenario: string;
  characters: string[];
  timeline: string;
  motivations: string;
  consequences: string;
  prevention: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysisId: string;
  analysis: AIAnalysisResult;
  storyPrompt: StoryPrompt;
  detailedReport: string;
}

class AIAnalysisService {
  private baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-76a6fe9f`;

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async analyzeContent(
    content: string, 
    contentType: 'text' | 'image' | 'video' | 'audio', 
    context?: string
  ): Promise<AnalysisResponse> {
    try {
      console.log(`Starting Vertex AI analysis for ${contentType} content...`);
      
      const response = await this.makeRequest('/analyze', {
        method: 'POST',
        body: JSON.stringify({
          content,
          contentType,
          context
        })
      });

      console.log('Vertex AI analysis completed successfully');
      return response;
    } catch (error) {
      console.error('Vertex AI analysis failed:', error);
      throw error;
    }
  }

  async getAnalysis(analysisId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get analysis:', error);
      throw error;
    }
  }

  async getRecentAnalyses(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/analyses');
      return response.data || [];
    } catch (error) {
      console.error('Failed to get recent analyses:', error);
      return [];
    }
  }

  async analyzeBatch(items: Array<{
    content: string;
    contentType: 'text' | 'image' | 'video' | 'audio';
    context?: string;
  }>): Promise<any> {
    try {
      console.log(`Starting Vertex AI batch analysis for ${items.length} items...`);
      
      const response = await this.makeRequest('/analyze-batch', {
        method: 'POST',
        body: JSON.stringify({ items })
      });

      console.log('Vertex AI batch analysis completed successfully');
      return response;
    } catch (error) {
      console.error('Vertex AI batch analysis failed:', error);
      throw error;
    }
  }

  // Helper method to get risk level color
  getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  // Helper method to get credibility score color
  getCredibilityColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  }

  // Helper method to format confidence percentage
  formatConfidence(confidence: number): string {
    return `${Math.round(confidence)}%`;
  }

  // Helper method to get issue type display name
  getIssueTypeDisplayName(type: string): string {
    const typeMap: Record<string, string> = {
      'factual_error': 'Factual Error',
      'bias': 'Bias Detected',
      'misleading_context': 'Misleading Context',
      'false_claim': 'False Claim',
      'manipulated_media': 'Manipulated Media',
      'conspiracy_theory': 'Conspiracy Theory',
      'hate_speech': 'Hate Speech',
      'spam': 'Spam Content'
    };
    return typeMap[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

export const aiAnalysisService = new AIAnalysisService();