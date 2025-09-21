import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Shield, 
  Users, 
  Flag, 
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Ban,
  Download
} from 'lucide-react';

const mockFlaggedContent = [
  {
    id: 'FC001',
    title: 'COVID vaccine conspiracy video',
    type: 'Video',
    flaggedBy: 'Dr. Sarah Chen',
    reason: 'Medical misinformation',
    timestamp: '2 hours ago',
    status: 'pending',
    severity: 'high',
    autoFlag: true
  },
  {
    id: 'FC002',
    title: 'Election fraud claims article',
    type: 'Article',
    flaggedBy: 'System Auto-Detection',
    reason: 'Political misinformation',
    timestamp: '4 hours ago',
    status: 'reviewed',
    severity: 'medium',
    autoFlag: true
  },
  {
    id: 'FC003',
    title: 'Climate change denial blog post',
    type: 'Blog Post',
    flaggedBy: 'Mark Rodriguez',
    reason: 'Environmental misinformation',
    timestamp: '1 day ago',
    status: 'approved',
    severity: 'low',
    autoFlag: false
  }
];

const mockUsers = [
  {
    id: 'U001',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    role: 'Fact-Checker',
    status: 'active',
    lastActive: '2 hours ago',
    analyses: 247,
    accuracy: 96.2
  },
  {
    id: 'U002',
    name: 'Mark Rodriguez',
    email: 'mark.r@newsorg.com',
    role: 'Journalist',
    status: 'active',
    lastActive: '5 hours ago',
    analyses: 156,
    accuracy: 94.8
  },
  {
    id: 'U003',
    name: 'Dr. Emily Watson',
    email: 'e.watson@research.org',
    role: 'Researcher',
    status: 'inactive',
    lastActive: '3 days ago',
    analyses: 89,
    accuracy: 97.1
  }
];

const mockSystemHealth = {
  apiStatus: 'healthy',
  processingQueue: 12,
  averageResponseTime: '2.3s',
  errorRate: '0.2%',
  uptime: '99.9%',
  dailyAnalyses: 1247,
  activeUsers: 89
};

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin & Moderation Panel</h1>
          <p className="text-muted-foreground">
            Manage flagged content and monitor system health with Cloud IAM integration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Flagged Content</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <Flag className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Moderators</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Content Flagged Today</p>
                    <p className="text-2xl font-bold">47</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                    <p className="text-2xl font-bold">99.9%</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Moderation Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { action: 'Content approved', user: 'Dr. Sarah Chen', time: '2 hours ago', type: 'approve' },
                  { action: 'User suspended', user: 'System Admin', time: '4 hours ago', type: 'suspend' },
                  { action: 'Content flagged', user: 'Auto-Detection', time: '6 hours ago', type: 'flag' },
                  { action: 'Appeal resolved', user: 'Mark Rodriguez', time: '8 hours ago', type: 'resolve' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 border-l-3 border-blue-500 bg-blue-50">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: 'warning', message: 'High volume of content flagged in last hour', time: '1 hour ago' },
                  { type: 'info', message: 'Scheduled maintenance completed successfully', time: '12 hours ago' },
                  { type: 'success', message: 'New fact-checker verified and added', time: '1 day ago' },
                  { type: 'warning', message: 'API rate limit approaching threshold', time: '2 days ago' }
                ].map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2">
                    {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />}
                    {alert.type === 'info' && <Clock className="w-4 h-4 text-blue-600 mt-0.5" />}
                    {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Flagged Content Review</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search content..." className="w-64" />
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Flagged By</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFlaggedContent.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-mono text-sm">{content.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{content.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{content.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{content.flaggedBy}</TableCell>
                      <TableCell className="text-sm">{content.reason}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getSeverityColor(content.severity)}`}>
                          {content.severity.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(content.status)}>
                          {content.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Ban className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search users..." className="w-64" />
                  <Button variant="outline" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Analyses</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.analyses}</TableCell>
                      <TableCell>{user.accuracy}%</TableCell>
                      <TableCell className="text-sm">{user.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Shield className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  API Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Response Time</span>
                    <span className="font-medium">{mockSystemHealth.averageResponseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Error Rate</span>
                    <span className="font-medium">{mockSystemHealth.errorRate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Processing Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Pending Jobs</span>
                    <span className="font-medium">{mockSystemHealth.processingQueue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Daily Analyses</span>
                    <span className="font-medium">{mockSystemHealth.dailyAnalyses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Users</span>
                    <span className="font-medium">{mockSystemHealth.activeUsers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>IAM Status</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Uptime</span>
                    <span className="font-medium">{mockSystemHealth.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Backup</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}