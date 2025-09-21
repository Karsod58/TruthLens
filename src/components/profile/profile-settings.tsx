import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  User, 
  Shield, 
  Key, 
  Bell, 
  Globe,
  Camera,
  Save,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Mail
} from 'lucide-react';

export function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    title: 'Senior Fact-Checker',
    organization: 'Stanford University',
    bio: 'Experienced fact-checker specializing in medical misinformation and public health communications.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
    location: 'Stanford, CA',
    website: 'https://med.stanford.edu/profiles/sarah-chen'
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    lastPasswordChange: '30 days ago',
    activeSessions: 3,
    apiKeysCount: 2
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    weeklyDigest: true,
    collaborationInvites: true,
    systemUpdates: false,
    marketingEmails: false
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your account details, security settings, and preferences
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Image */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your profile information is secured with Google Cloud Identity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Job Title</label>
                      <Input value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Organization</label>
                      <Input value={profile.organization} onChange={(e) => setProfile({...profile, organization: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea 
                      value={profile.bio} 
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <Input value={profile.website} onChange={(e) => setProfile({...profile, website: e.target.value})} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">2FA Enabled</p>
                      <p className="text-sm text-muted-foreground">Using authenticator app</p>
                    </div>
                  </div>
                  <Switch checked={security.twoFactorEnabled} />
                </div>
                
                <Button variant="outline" className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Manage 2FA Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Password & Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Last password change:</span>
                    <span className="font-medium">{security.lastPasswordChange}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active sessions:</span>
                    <span className="font-medium">{security.activeSessions} devices</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Active Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Security Activity</CardTitle>
                <CardDescription>Recent security events for your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { event: 'Successful login', device: 'Chrome on MacOS', time: '2 hours ago', status: 'success' },
                    { event: 'Password changed', device: 'Account settings', time: '30 days ago', status: 'info' },
                    { event: '2FA enabled', device: 'Mobile app', time: '45 days ago', status: 'success' },
                    { event: 'Failed login attempt', device: 'Unknown device', time: '60 days ago', status: 'warning' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                      {activity.status === 'info' && <Globe className="w-4 h-4 text-blue-600" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.event}</p>
                        <p className="text-xs text-muted-foreground">{activity.device} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about TruthLens activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Alert Notifications</h4>
                <div className="space-y-3">
                  {[
                    { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive critical alerts via email', icon: Mail },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Get instant notifications on your device', icon: Smartphone }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <setting.icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{setting.label}</p>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications[setting.key as keyof typeof notifications]} 
                        onCheckedChange={(checked) => setNotifications({...notifications, [setting.key]: checked})}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Content Notifications</h4>
                <div className="space-y-3">
                  {[
                    { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of your analysis activity' },
                    { key: 'collaborationInvites', label: 'Collaboration Invites', description: 'When someone invites you to collaborate' },
                    { key: 'systemUpdates', label: 'System Updates', description: 'Platform updates and new features' },
                    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Tips, best practices, and product news' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-2">
                      <div>
                        <p className="font-medium">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch 
                        checked={notifications[setting.key as keyof typeof notifications]} 
                        onCheckedChange={(checked) => setNotifications({...notifications, [setting.key]: checked})}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                API Access & Keys
              </CardTitle>
              <CardDescription>
                Manage your API keys for Google Cloud services integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">API Usage</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">This Month</p>
                    <p className="font-semibold text-blue-900">2,847 calls</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Rate Limit</p>
                    <p className="font-semibold text-blue-900">10,000/month</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Remaining</p>
                    <p className="font-semibold text-blue-900">7,153 calls</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Active API Keys</h4>
                  <Button size="sm">
                    <Key className="w-4 h-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
                
                {[
                  { name: 'Production API Key', created: '30 days ago', lastUsed: '2 hours ago', permissions: 'Full Access' },
                  { name: 'Development API Key', created: '60 days ago', lastUsed: '1 week ago', permissions: 'Read Only' }
                ].map((key, index) => (
                  <div key={index} className="p-3 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">{key.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Created {key.created} • Last used {key.lastUsed}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">{key.permissions}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Manage your data preferences and download your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Data Export</h4>
                <p className="text-sm text-muted-foreground">
                  Download a copy of your data including analysis history, collaboration records, and account information.
                </p>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Request Data Export
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Privacy Settings</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Share analysis history with research partners', description: 'Help improve misinformation detection algorithms' },
                    { label: 'Allow profile visibility to other fact-checkers', description: 'Let verified fact-checkers see your profile' },
                    { label: 'Include my contributions in public statistics', description: 'Anonymous contribution to platform statistics' }
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-2">
                      <div>
                        <p className="font-medium">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch defaultChecked={index < 2} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-red-900">Danger Zone</h4>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-medium text-red-900">Delete Account</h5>
                      <p className="text-sm text-red-700 mb-3">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}