import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Search
} from 'lucide-react';

const mockAnalyticsData = {
  weekly: [
    { day: 'Mon', analyses: 45, misinformation: 12, accurate: 33 },
    { day: 'Tue', analyses: 52, misinformation: 8, accurate: 44 },
    { day: 'Wed', analyses: 38, misinformation: 15, accurate: 23 },
    { day: 'Thu', analyses: 61, misinformation: 18, accurate: 43 },
    { day: 'Fri', analyses: 49, misinformation: 11, accurate: 38 },
    { day: 'Sat', analyses: 29, misinformation: 6, accurate: 23 },
    { day: 'Sun', analyses: 33, misinformation: 9, accurate: 24 }
  ],
  categories: [
    { name: 'Fake News', value: 35, color: '#ef4444' },
    { name: 'Misleading Stats', value: 28, color: '#f97316' },
    { name: 'Deepfakes', value: 15, color: '#eab308' },
    { name: 'Phishing', value: 12, color: '#84cc16' },
    { name: 'Other', value: 10, color: '#6b7280' }
  ],
  recentAnalyses: [
    {
      id: 'A001',
      title: 'COVID-19 vaccine study claims',
      timestamp: '2024-01-15 10:30',
      score: 32,
      type: 'Article',
      status: 'misinformation',
      source: 'news-site.com'
    },
    {
      id: 'A002', 
      title: 'Climate change data visualization',
      timestamp: '2024-01-15 09:15',
      score: 85,
      type: 'Image',
      status: 'verified',
      source: 'research-org.edu'
    },
    {
      id: 'A003',
      title: 'Election poll results breakdown',
      timestamp: '2024-01-15 08:45',
      score: 67,
      type: 'Video',
      status: 'mostly_accurate',
      source: 'news-channel.com'
    },
    {
      id: 'A004',
      title: 'Economic policy analysis',
      timestamp: '2024-01-14 16:20',
      score: 45,
      type: 'Document',
      status: 'questionable',
      source: 'policy-think-tank.org'
    },
    {
      id: 'A005',
      title: 'Health supplement claims',
      timestamp: '2024-01-14 14:10',
      score: 18,
      type: 'Article',
      status: 'misinformation',
      source: 'wellness-blog.com'
    }
  ]
};

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState('7d');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'mostly_accurate': return 'bg-blue-100 text-blue-800';
      case 'questionable': return 'bg-yellow-100 text-yellow-800';
      case 'misinformation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'mostly_accurate':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'questionable':
      case 'misinformation':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis history and insights powered by BigQuery
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search analyses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
                <p className="text-2xl font-bold">1,247</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">+12.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Misinformation Detected</p>
                <p className="text-2xl font-bold">187</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-red-600">-8.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                <p className="text-2xl font-bold">94.2%</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">+2.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">2.3s</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">-0.4s</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Analysis Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Analysis Trend</CardTitle>
            <CardDescription>Daily analysis volume and results breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalyticsData.weekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accurate" stackId="a" fill="#22c55e" name="Accurate" />
                <Bar dataKey="misinformation" stackId="a" fill="#ef4444" name="Misinformation" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Misinformation Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Misinformation Categories</CardTitle>
            <CardDescription>Distribution of detected misinformation types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockAnalyticsData.categories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockAnalyticsData.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
          <CardDescription>Detailed history of content verification results</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAnalyticsData.recentAnalyses.map((analysis) => (
                <TableRow key={analysis.id}>
                  <TableCell className="font-mono text-sm">{analysis.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{analysis.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{analysis.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(analysis.status)}
                      <span className="font-medium">{analysis.score}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(analysis.status)}>
                      {analysis.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {analysis.source}
                  </TableCell>
                  <TableCell className="text-sm">{analysis.timestamp}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}