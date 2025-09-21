import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Bell, 
  Plus, 
  Settings, 
  Mail, 
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Filter
} from 'lucide-react';

const mockAlerts = [
  {
    id: 1,
    title: 'COVID vaccine misinformation spike',
    keywords: ['covid', 'vaccine', 'side effects'],
    sources: ['Twitter', 'Facebook', 'News sites'],
    severity: 'high',
    frequency: 'immediate',
    enabled: true,
    lastTriggered: '2 hours ago',
    triggerCount: 47
  },
  {
    id: 2,
    title: 'Election integrity claims monitoring',
    keywords: ['voting machines', 'election fraud', 'ballot'],
    sources: ['All social media'],
    severity: 'medium',
    frequency: 'daily',
    enabled: true,
    lastTriggered: '1 day ago',
    triggerCount: 23
  },
  {
    id: 3,
    title: 'Climate change denial content',
    keywords: ['climate hoax', 'global warming fake'],
    sources: ['YouTube', 'Blogs'],
    severity: 'low',
    frequency: 'weekly',
    enabled: false,
    lastTriggered: '1 week ago',
    triggerCount: 12
  }
];

const mockNotifications = [
  {
    id: 1,
    type: 'alert',
    title: 'High Priority: COVID misinformation surge detected',
    message: '47 new instances of vaccine misinformation found across monitored platforms',
    timestamp: '2 hours ago',
    read: false,
    severity: 'high'
  },
  {
    id: 2,
    type: 'system',
    title: 'Weekly analysis report ready',
    message: 'Your weekly misinformation detection report is now available for download',
    timestamp: '1 day ago',
    read: false,
    severity: 'medium'
  },
  {
    id: 3,
    type: 'collaboration',
    title: 'New fact-check discussion: Election claims',
    message: 'Dr. Sarah Chen started a new discussion that may require your expertise',
    timestamp: '3 hours ago',
    read: true,
    severity: 'medium'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Deepfake video detected',
    message: 'Potential deepfake content found in uploaded media batch #127',
    timestamp: '5 hours ago',
    read: true,
    severity: 'high'
  }
];

export function AlertsNotifications() {
  const [activeTab, setActiveTab] = useState('alerts');
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    keywords: '',
    sources: [],
    severity: 'medium',
    frequency: 'daily'
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'system': return <Settings className="w-5 h-5 text-blue-600" />;
      case 'collaboration': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
          <p className="text-muted-foreground">
            Configure custom alerts powered by Pub/Sub and Firebase Cloud Messaging
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowCreateAlert(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'alerts' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('alerts')}
        >
          Custom Alerts
        </Button>
        <Button
          variant={activeTab === 'notifications' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('settings')}
        >
          Preferences
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {/* Alert Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Triggered Today</p>
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
                    <p className="text-sm text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-2xl font-bold">12m</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Custom Alert Rules</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search alerts..." className="w-64" />
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{alert.title}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity} priority
                        </Badge>
                        <Switch checked={alert.enabled} />
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Keywords:</strong> {alert.keywords.join(', ')}</p>
                        <p><strong>Sources:</strong> {alert.sources.join(', ')}</p>
                        <p><strong>Frequency:</strong> {alert.frequency}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                    <span>Last triggered: {alert.lastTriggered}</span>
                    <span>Total triggers: {alert.triggerCount}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Real-time notifications from your alert rules and system updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg flex items-start space-x-3 ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {notification.type}
                      </Badge>
                      <Badge className={`text-xs ${getSeverityColor(notification.severity)}`}>
                        {notification.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts via email
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get instant push notifications
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                
                <div className="space-y-3">
                  {[
                    'High priority alerts',
                    'Daily digest reports',
                    'System maintenance updates',
                    'Collaboration invitations',
                    'Weekly analytics summaries'
                  ].map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-2">
                      <span className="text-sm">{type}</span>
                      <Switch defaultChecked={index < 3} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Quiet Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Time</label>
                    <Select defaultValue="22:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Time</label>
                    <Select defaultValue="07:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}