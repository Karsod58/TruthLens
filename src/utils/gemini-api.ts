import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-76a6fe9f`;

export interface MisinformationAnalysis {
  id?: string;
  isCredible: boolean;
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categories: string[];
  keyFindings: string[];
  sources: {
    reliable: string[];
    questionable: string[];
  };
  redFlags: string[];
  context: {
    timeframe: string;
    relevantEvents: string[];
    similarClaims: string[];
  };
  attackerProfile: {
    likelyMotivation: string;
    targetAudience: string;
    sophisticationLevel: string;
  };
  narrative: {
    howItSpread: string;
    amplificationMethods: string[];
    timeline: string;
  };
  timestamp?: string;
  content?: string;
  contentType?: string;
}

export interface StoryPrompt {
  id?: string;
  scenario: string;
  characters: string[];
  timeline: string;
  motivation: string;
  consequences: string;
  educationalMessage: string;
  analysisId?: string;
  timestamp?: string;
}

export async function analyzeContent(content: string, contentType: 'text' | 'image' | 'video' | 'audio'): Promise<{ analysis: MisinformationAnalysis; analysisId: string }> {
  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ content, contentType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Analysis failed');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Analysis failed');
    }

    return {
      analysis: data.analysis,
      analysisId: data.analysisId
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

export async function generateStory(analysisId: string): Promise<{ story: StoryPrompt; storyId: string }> {
  try {
    const response = await fetch(`${API_BASE}/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ analysisId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Story generation failed');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Story generation failed');
    }

    return {
      story: data.story,
      storyId: data.storyId
    };
  } catch (error) {
    console.error('Story generation error:', error);
    throw error;
  }
}

export async function getAnalysis(analysisId: string): Promise<MisinformationAnalysis> {
  try {
    const response = await fetch(`${API_BASE}/analysis/${analysisId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analysis');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('Get analysis error:', error);
    throw error;
  }
}

export async function getAllAnalyses(): Promise<MisinformationAnalysis[]> {
  try {
    const response = await fetch(`${API_BASE}/analyses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analyses');
    }

    const data = await response.json();
    return data.analyses || [];
  } catch (error) {
    console.error('Get analyses error:', error);
    throw error;
  }
}

export async function getStory(storyId: string): Promise<StoryPrompt> {
  try {
    const response = await fetch(`${API_BASE}/story/${storyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch story');
    }

    const data = await response.json();
    return data.story;
  } catch (error) {
    console.error('Get story error:', error);
    throw error;
  }
}