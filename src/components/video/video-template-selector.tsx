import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Clock, Play, Settings, CheckCircle } from 'lucide-react';
import { VideoTemplate, VideoGenerationOptions } from '../../services/video-generation';

interface VideoTemplateSelectorProps {
  templates: VideoTemplate[];
  selectedTemplate: VideoTemplate | null;
  onTemplateSelect: (template: VideoTemplate) => void;
  onOptionsChange: (options: VideoGenerationOptions) => void;
  options: VideoGenerationOptions;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function VideoTemplateSelector({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onOptionsChange,
  options,
  onGenerate,
  isGenerating
}: VideoTemplateSelectorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleOptionChange = (key: keyof VideoGenerationOptions, value: any) => {
    onOptionsChange({
      ...options,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Video Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  {selectedTemplate?.id === template.id && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(template.duration / 60)}:{(template.duration % 60).toString().padStart(2, '0')}</span>
                  <Badge variant="outline" className="text-xs">
                    {template.style}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="w-full h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <Play className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Video Options
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
              <input
                type="number"
                min="30"
                max="300"
                value={options.duration || 120}
                onChange={(e) => handleOptionChange('duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quality</label>
              <select
                value={options.quality || 'medium'}
                onChange={(e) => handleOptionChange('quality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low (480p)</option>
                <option value="medium">Medium (720p)</option>
                <option value="high">High (1080p)</option>
              </select>
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Style</label>
                  <select
                    value={options.style || 'educational'}
                    onChange={(e) => handleOptionChange('style', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="educational">Educational</option>
                    <option value="dramatic">Dramatic</option>
                    <option value="informative">Informative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    value={options.language || 'en'}
                    onChange={(e) => handleOptionChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="te">Telugu</option>
                    <option value="ta">Tamil</option>
                    <option value="ur">Urdu</option>
                    <option value="ar">Arabic</option>
                    <option value="zh">Chinese</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeSubtitles"
                  checked={options.includeSubtitles ?? true}
                  onChange={(e) => handleOptionChange('includeSubtitles', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="includeSubtitles" className="text-sm font-medium">
                  Include subtitles
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={onGenerate}
          disabled={!selectedTemplate || isGenerating}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Video...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Generate Video
            </>
          )}
        </Button>
      </div>

      {/* Selected Template Summary */}
      {selectedTemplate && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Selected: {selectedTemplate.name}</h4>
                <p className="text-sm text-blue-700">
                  Duration: {Math.floor(selectedTemplate.duration / 60)}:{(selectedTemplate.duration % 60).toString().padStart(2, '0')} • 
                  Style: {selectedTemplate.style} • 
                  Quality: {options.quality || 'medium'}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                Ready to Generate
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
