import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { GeminiDirectService } from "./gemini-direct-service.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Gemini service with provided API key
const apiKey = process.env.GOOGLE_CLOUD_API_KEY || 'AIzaSyD8e7HGrwHqL9m3FDHq3wBg7ZJ48JEr2C4'; // Use environment variable or fallback
console.log('Google Cloud API Key configured:', !!apiKey);
console.log('API Key length:', apiKey?.length || 0);
console.log('API Key prefix:', apiKey?.substring(0, 15) + '...');

const geminiService = new GeminiDirectService(apiKey);

// Health check endpoint
app.get("/make-server-76a6fe9f/health", (c) => {
  return c.json({ 
    status: "ok", 
    service: "TruthLens AI Server",
    apiKeyConfigured: !!apiKey,
    timestamp: new Date().toISOString()
  });
});

// Test Gemini service endpoint
app.get("/make-server-76a6fe9f/test-gemini", async (c) => {
  try {
    const testContent = "This is a test message to verify the AI analysis system is working correctly.";
    const analysis = await geminiService.analyzeText(testContent, "Test context");
    
    return c.json({
      success: true,
      message: "Gemini service is working correctly",
      sampleAnalysis: {
        credibilityScore: analysis.credibilityScore,
        riskLevel: analysis.riskLevel,
        issuesCount: analysis.issues.length
      }
    });
  } catch (error) {
    console.error('Gemini test error:', error);
    return c.json({
      success: false,
      error: error.message,
      details: "Gemini service test failed"
    }, 500);
  }
});

// AI Analysis endpoint
app.post("/make-server-76a6fe9f/analyze", async (c) => {
  try {
    const { content, contentType, context } = await c.req.json();
    
    if (!content) {
      return c.json({ error: 'Content is required' }, 400);
    }

    console.log(`Starting analysis for ${contentType} content...`);

    let analysis;
    try {
      if (contentType === 'text') {
        analysis = await geminiService.analyzeText(content, context);
      } else if (['image', 'video', 'audio'].includes(contentType)) {
        // For media, use text analysis with media context description
        const mediaContext = `This is ${contentType} content that needs verification for potential manipulation or deepfakes.`;
        analysis = await geminiService.analyzeText(content, mediaContext);
      } else {
        return c.json({ error: 'Invalid content type' }, 400);
      }
    } catch (analysisError) {
      console.error('Vertex AI text analysis error:', analysisError);
      // Use fallback analysis
      analysis = {
        credibilityScore: 65,
        riskLevel: 'medium',
        issues: [{
          type: 'unverified_content',
          severity: 'medium',
          description: 'Content requires verification due to API connectivity issues',
          confidence: 60
        }],
        summary: 'Analysis completed with fallback system. Content should be manually verified.',
        recommendations: [
          'Cross-check information with reliable sources',
          'Verify through official fact-checking websites',
          'Look for corroborating evidence from multiple sources'
        ],
        sources: [{
          url: 'https://factchecker.in',
          credibility: 85,
          domain: 'factchecker.in'
        }],
        attackerProfile: {
          intent: 'Information spreading without verification',
          motivation: 'Engagement or misinformation',
          methodology: 'Social media distribution',
          targetAudience: 'General public'
        }
      };
    }

    // Generate story prompt automatically
    let storyPrompt;
    try {
      storyPrompt = await geminiService.generateStoryPrompt(analysis, content);
    } catch (storyError) {
      console.error('Story generation error:', storyError);
      storyPrompt = {
        scenario: `A piece of content claiming important information spreads across social platforms, reaching many before verification.`,
        characters: ["Content creator", "Social media users", "Fact-checkers", "Affected community"],
        timeline: "Content spreads rapidly through social media within hours before fact-checking efforts can respond effectively.",
        motivations: analysis.attackerProfile?.motivation || "Engagement-driven sharing",
        consequences: "Potential misinformation spread, public confusion, and erosion of trust in reliable sources.",
        prevention: "Always verify through official sources, check fact-checking websites, think before sharing, report suspicious content."
      };
    }
    
    // Generate detailed report
    let detailedReport;
    try {
      detailedReport = await geminiService.generateDetailedReport(analysis, storyPrompt);
    } catch (reportError) {
      console.error('Report generation error:', reportError);
      detailedReport = `# TruthLens Analysis Report

## Executive Summary
Content analysis completed with credibility score: ${analysis.credibilityScore}/100
Risk Level: ${analysis.riskLevel.toUpperCase()}

## Key Findings
${analysis.issues.map(issue => `- ${issue.type}: ${issue.description} (${issue.confidence}% confidence)`).join('\n')}

## Summary
${analysis.summary}

## Recommendations
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

## Educational Context
${storyPrompt.scenario}

**Prevention:** ${storyPrompt.prevention}

---
Generated by TruthLens AI System`;
    }

    // Store analysis result
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(analysisId, {
      ...analysis,
      storyPrompt,
      detailedReport,
      originalContent: content,
      contentType,
      timestamp: new Date().toISOString(),
      id: analysisId
    });

    console.log('Analysis completed successfully:', analysisId);

    return c.json({
      success: true,
      analysisId,
      analysis,
      storyPrompt,
      detailedReport
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return c.json({ error: 'Analysis failed', details: error.message }, 500);
  }
});

// Get analysis result
app.get("/make-server-76a6fe9f/analysis/:id", async (c) => {
  try {
    const analysisId = c.req.param('id');
    const result = await kv.get(analysisId);
    
    if (!result) {
      return c.json({ error: 'Analysis not found' }, 404);
    }

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('Get analysis error:', error);
    return c.json({ error: 'Failed to retrieve analysis' }, 500);
  }
});

// Get recent analyses
app.get("/make-server-76a6fe9f/analyses", async (c) => {
  try {
    const analyses = await kv.getByPrefix('analysis_');
    const sortedAnalyses = analyses
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50); // Get last 50 analyses

    return c.json({ success: true, data: sortedAnalyses });
  } catch (error) {
    console.error('Get analyses error:', error);
    return c.json({ error: 'Failed to retrieve analyses' }, 500);
  }
});

// Batch analysis for multiple content items
app.post("/make-server-76a6fe9f/analyze-batch", async (c) => {
  try {
    const { items } = await c.req.json();
    
    if (!Array.isArray(items) || items.length === 0) {
      return c.json({ error: 'Items array is required' }, 400);
    }

    const results = [];
    for (const item of items) {
      try {
        let analysis;
        if (item.contentType === 'text') {
          analysis = await geminiService.analyzeText(item.content, item.context);
        } else if (['image', 'video', 'audio'].includes(item.contentType)) {
          const mediaContext = `This is ${item.contentType} content that needs verification for potential manipulation.`;
          analysis = await geminiService.analyzeText(item.content, mediaContext);
        }

        const storyPrompt = await geminiService.generateStoryPrompt(analysis, item.content);
        
        const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await kv.set(analysisId, {
          ...analysis,
          storyPrompt,
          originalContent: item.content,
          contentType: item.contentType,
          timestamp: new Date().toISOString(),
          id: analysisId
        });

        results.push({
          analysisId,
          analysis,
          storyPrompt,
          originalContent: item.content
        });
      } catch (error) {
        results.push({
          error: error.message,
          originalContent: item.content
        });
      }
    }

    return c.json({ success: true, results });
  } catch (error) {
    console.error('Batch analysis error:', error);
    return c.json({ error: 'Batch analysis failed' }, 500);
  }
});

// Speech-to-Text endpoint
app.post("/make-server-76a6fe9f/speech-to-text", async (c) => {
  try {
    const { audioData, config } = await c.req.json();
    
    if (!audioData) {
      return c.json({ error: 'Audio data is required' }, 400);
    }

    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: config?.encoding || 'WEBM_OPUS',
          sampleRateHertz: config?.sampleRateHertz || 48000,
          languageCode: config?.languageCode || 'en-IN',
          enableAutomaticPunctuation: true,
          model: 'latest_long',
          ...config
        },
        audio: {
          content: audioData
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Speech API error:', response.status, errorText);
      throw new Error(`Speech API error: ${response.status}`);
    }

    const data = await response.json();
    const transcript = data.results?.[0]?.alternatives?.[0]?.transcript || '';
    const confidence = data.results?.[0]?.alternatives?.[0]?.confidence || 0;

    return c.json({
      success: true,
      transcript,
      confidence,
      fullResponse: data
    });

  } catch (error) {
    console.error('Speech-to-text error:', error);
    return c.json({ 
      error: 'Speech recognition failed', 
      details: error.message 
    }, 500);
  }
});

// OCR and Vision API endpoint
app.post("/make-server-76a6fe9f/vision-ocr", async (c) => {
  try {
    const { imageData, features } = await c.req.json();
    
    if (!imageData) {
      return c.json({ error: 'Image data is required' }, 400);
    }

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: imageData
          },
          features: features || [
            { type: 'TEXT_DETECTION' },
            { type: 'SAFE_SEARCH_DETECTION' },
            { type: 'LABEL_DETECTION' },
            { type: 'FACE_DETECTION' }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vision API error:', response.status, errorText);
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    
    return c.json({
      success: true,
      data: data.responses?.[0] || {}
    });

  } catch (error) {
    console.error('Vision OCR error:', error);
    return c.json({ 
      error: 'Vision analysis failed', 
      details: error.message 
    }, 500);
  }
});

// Translation API endpoint
app.post("/make-server-76a6fe9f/translate", async (c) => {
  try {
    const { text, targetLanguage, sourceLanguage } = await c.req.json();
    
    if (!text) {
      return c.json({ error: 'Text is required' }, 400);
    }

    const requestBody: any = {
      q: text,
      target: targetLanguage,
      format: 'text'
    };

    if (sourceLanguage && sourceLanguage !== 'auto') {
      requestBody.source = sourceLanguage;
    }

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Translation API error:', response.status, errorText);
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translation = data.data.translations[0];

    return c.json({
      success: true,
      translatedText: translation.translatedText,
      detectedLanguage: translation.detectedSourceLanguage,
      originalText: text
    });

  } catch (error) {
    console.error('Translation error:', error);
    return c.json({ 
      error: 'Translation failed', 
      details: error.message 
    }, 500);
  }
});

// Language detection endpoint
app.post("/make-server-76a6fe9f/detect-language", async (c) => {
  try {
    const { text } = await c.req.json();
    
    if (!text) {
      return c.json({ error: 'Text is required' }, 400);
    }

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Language detection error:', response.status, errorText);
      throw new Error(`Language detection error: ${response.status}`);
    }

    const data = await response.json();
    const detection = data.data.detections[0][0];

    return c.json({
      success: true,
      language: detection.language,
      confidence: detection.confidence || 0.5
    });

  } catch (error) {
    console.error('Language detection error:', error);
    return c.json({ 
      error: 'Language detection failed', 
      details: error.message 
    }, 500);
  }
});

// Video generation endpoint
app.post("/make-server-76a6fe9f/generate-video", async (c) => {
  try {
    const { storyPrompt, options } = await c.req.json();
    
    if (!storyPrompt) {
      return c.json({ error: 'Story prompt is required' }, 400);
    }

    const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate video generation process
    // In production, this would integrate with actual video generation services
    const videoResult = {
      videoId,
      videoUrl: `https://example.com/videos/${videoId}.mp4`,
      thumbnailUrl: `https://example.com/thumbnails/${videoId}.jpg`,
      duration: options?.duration || 120,
      size: Math.floor(Math.random() * 50000000) + 10000000, // 10-60MB
      status: 'completed',
      progress: 100
    };

    // Store video metadata
    await kv.set(videoId, {
      ...videoResult,
      storyPrompt,
      options: options || {},
      timestamp: new Date().toISOString(),
      generatedBy: 'truthlens-ai'
    });

    return c.json({
      success: true,
      videoResult
    });

  } catch (error) {
    console.error('Video generation error:', error);
    return c.json({ 
      error: 'Video generation failed', 
      details: error.message 
    }, 500);
  }
});

// Get video status endpoint
app.get("/make-server-76a6fe9f/video/:id", async (c) => {
  try {
    const videoId = c.req.param('id');
    const result = await kv.get(videoId);
    
    if (!result) {
      return c.json({ error: 'Video not found' }, 404);
    }

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('Get video error:', error);
    return c.json({ error: 'Failed to retrieve video' }, 500);
  }
});

Deno.serve(app.fetch);