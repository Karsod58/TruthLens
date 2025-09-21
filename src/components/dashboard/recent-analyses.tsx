import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, ExternalLink } from 'lucide-react';

const mockRecentAnalyses = [
  {
    id: '1',
    title: 'COVID-19 vaccine effectiveness study',
    timestamp: '2 hours ago',
    score: 85,
    type: 'Article',
    status: 'verified'
  },
  {
    id: '2',
    title: 'Climate change data visualization',
    timestamp: '4 hours ago',
    score: 32,
    type: 'Image',
    status: 'misinformation'
  },
  {
    id: '3',
    title: 'Election results breakdown',
    timestamp: '6 hours ago',
    score: 78,
    type: 'Video',
    status: 'mostly_accurate'
  },
  {
    id: '4',
    title: 'Economic policy analysis',
    timestamp: '1 day ago',
    score: 45,
    type: 'Document',
    status: 'questionable'
  },
  {
    id: '5',
    title: 'Health supplement claims',
    timestamp: '1 day ago',
    score: 15,
    type: 'Article',
    status: 'misinformation'
  }
];

export function RecentAnalyses() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'mostly_accurate': return 'bg-blue-100 text-blue-800';
      case 'questionable': return 'bg-yellow-100 text-yellow-800';
      case 'misinformation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'mostly_accurate': return 'Mostly Accurate';
      case 'questionable': return 'Questionable';
      case 'misinformation': return 'Misinformation';
      default: return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Analyses</CardTitle>
        <CardDescription>
          Your latest content verification results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRecentAnalyses.map((analysis) => (
          <div key={analysis.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium line-clamp-2 flex-1">
                  {analysis.title}
                </h4>
                <Button variant="ghost" size="sm" className="shrink-0 ml-2">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {analysis.type}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(analysis.status)}`}>
                    {analysis.score}%
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {analysis.timestamp}
                </span>
              </div>
              
              <div className="text-xs">
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(analysis.status)} border-0`}
                >
                  {getStatusText(analysis.status)}
                </Badge>
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full" size="sm">
          View All Analyses
        </Button>
      </CardContent>
    </Card>
  );
}