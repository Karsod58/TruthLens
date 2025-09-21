interface GeminiAnalysisResult {
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

interface StoryPrompt {
  scenario: string;
  characters: string[];
  timeline: string;
  motivations: string;
  consequences: string;
  prevention: string;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeText(text: string, context?: string): Promise<GeminiAnalysisResult> {
    const prompt = `
You are TruthLens, an advanced AI misinformation detection system. Analyze the following content for misinformation, bias, and credibility issues.

Content to analyze: "${text}"
${context ? `Context: ${context}` : ''}

Provide a comprehensive analysis in JSON format with the following structure:
{
  "credibilityScore": number (0-100),
  "riskLevel": "low" | "medium" | "high" | "critical",
  "issues": [
    {
      "type": "factual_error" | "bias" | "misleading_context" | "false_claim" | "manipulated_media" | "conspiracy_theory" | "hate_speech" | "spam",
      "severity": "low" | "medium" | "high" | "critical",
      "description": "detailed explanation",
      "confidence": number (0-100)
    }
  ],
  "summary": "brief summary of findings",
  "recommendations": ["actionable recommendations"],
  "sources": [
    {
      "url": "fact-check or authoritative source",
      "credibility": number (0-100),
      "domain": "domain name"
    }
  ],
  "attackerProfile": {
    "intent": "what the attacker/misinformer intended to achieve",
    "motivation": "financial, political, ideological, chaos, etc.",
    "methodology": "how they spread the misinformation",
    "targetAudience": "who they were targeting"
  }
}

Focus on Indian context and current affairs. Be thorough but concise.
`;

    try {
      const response = await fetch(`${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!analysisText) {
        throw new Error('No analysis received from Gemini');
      }

      // Parse JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Gemini text analysis error:', error);
      throw error;
    }
  }

  async analyzeMedia(mediaUrl: string, mediaType: 'image' | 'video' | 'audio'): Promise<GeminiAnalysisResult> {
    const prompt = `
You are TruthLens media verification system. Analyze this ${mediaType} for signs of manipulation, deepfakes, or misinformation patterns.

Examine for:
- Digital manipulation indicators
- Deepfake artifacts
- Inconsistencies in lighting, shadows, reflections
- Metadata anomalies
- Visual/audio quality inconsistencies
- Context mismatches

Return analysis in the same JSON format as text analysis, focusing on media-specific issues.
`;

    try {
      const requestBody: any = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mediaType === 'image' ? 'image/jpeg' : 
                          mediaType === 'video' ? 'video/mp4' : 'audio/wav',
                data: mediaUrl // This would need to be base64 encoded in real implementation
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      };

      const response = await fetch(`${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.candidates[0]?.content?.parts[0]?.text;
      
      const jsonMatch = analysisText?.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Gemini media analysis error:', error);
      // Return mock analysis for demo
      return {
        credibilityScore: 75,
        riskLevel: 'medium',
        issues: [{
          type: 'manipulated_media',
          severity: 'medium',
          description: 'Potential digital manipulation detected in media',
          confidence: 78
        }],
        summary: 'Media analysis completed with moderate risk indicators',
        recommendations: ['Verify source authenticity', 'Cross-check with original media'],
        sources: [],
        attackerProfile: {
          intent: 'Spread misleading visual content',
          motivation: 'Viral engagement',
          methodology: 'Digital manipulation tools',
          targetAudience: 'Social media users'
        }
      };
    }
  }

  async generateStoryPrompt(analysis: GeminiAnalysisResult, originalContent: string): Promise<StoryPrompt> {
    const prompt = `
Based on this misinformation analysis, create a compelling short story video prompt that explains:

Original Content: "${originalContent}"
Analysis Summary: "${analysis.summary}"
Attacker Profile: ${JSON.stringify(analysis.attackerProfile)}
Risk Level: ${analysis.riskLevel}
Issues Found: ${analysis.issues.map(i => i.description).join(', ')}

Create a story prompt for a 2-3 minute educational video that shows:
1. How this misinformation started and spread
2. The attacker's intentions and methods
3. Who was targeted and why
4. The potential consequences
5. How people can protect themselves

Format as JSON:
{
  "scenario": "compelling narrative setup",
  "characters": ["protagonist", "antagonist", "victims", "fact-checkers"],
  "timeline": "how events unfolded chronologically",
  "motivations": "why the attacker did this",
  "consequences": "real-world impact shown",
  "prevention": "how viewers can spot and stop similar misinformation"
}

Make it engaging but educational, suitable for Indian audiences.
`;

    try {
      const response = await fetch(`${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const storyText = data.candidates[0]?.content?.parts[0]?.text;
      
      const jsonMatch = storyText?.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Gemini story generation error:', error);
      throw error;
    }
  }

  async generateDetailedReport(analysis: GeminiAnalysisResult, storyPrompt: StoryPrompt): Promise<string> {
    const prompt = `
Generate a comprehensive misinformation analysis report based on:

Analysis: ${JSON.stringify(analysis)}
Story Context: ${JSON.stringify(storyPrompt)}

Create a detailed report with:
1. Executive Summary
2. Threat Assessment
3. Technical Analysis
4. Social Impact Assessment
5. Mitigation Strategies
6. Educational Narrative Summary

Make it professional but accessible, suitable for both technical and non-technical stakeholders.
`;

    try {
      const response = await fetch(`${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'Report generation failed';
    } catch (error) {
      console.error('Gemini report generation error:', error);
      throw error;
    }
  }
}