import React from 'react';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

interface TruthScoreMeterProps {
  score: number;
  confidence: number;
}

export function TruthScoreMeter({ score, confidence }: TruthScoreMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Likely Accurate';
    if (score >= 60) return 'Uncertain';
    return 'Likely Misinformation';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Truth Score</h3>
        <Badge variant="outline">
          Confidence: {confidence}%
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
          <span className={`text-sm font-medium ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </span>
        </div>
        
        <div className="relative">
          <Progress value={score} className="h-3" />
          <div 
            className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Misinformation</span>
          <span>Uncertain</span>
          <span>Accurate</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Analysis powered by Google Vertex AI & Natural Language API
      </div>
    </div>
  );
}