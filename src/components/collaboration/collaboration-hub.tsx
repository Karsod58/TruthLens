import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Users, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MessageCircle
} from 'lucide-react';

const mockDiscussions = [
  {
    id: 1,
    title: 'COVID-19 vaccine misinformation surge',
    author: 'Dr. Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150&h=150&fit=crop&crop=face',
    timestamp: '2 hours ago',
    category: 'Health Misinformation',
    status: 'active',
    priority: 'high',
    replies: 23,
    upvotes: 45,
    content: 'Seeing increased spread of false claims about vaccine side effects. Need collaborative fact-check on new viral video.',
    tags: ['covid', 'vaccines', 'urgent']
  },
  {
    id: 2,
    title: 'Election integrity claims verification',
    author: 'Mark Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    timestamp: '4 hours ago',
    category: 'Political',
    status: 'verified',
    priority: 'medium',
    replies: 12,
    upvotes: 28,
    content: 'Multiple claims circulating about voting machine security. Have preliminary analysis, need peer review.',
    tags: ['politics', 'voting', 'security']
  },
  {
    id: 3,
    title: 'Climate data manipulation detected',
    author: 'Dr. Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    timestamp: '6 hours ago',
    category: 'Environment',
    status: 'investigating',
    priority: 'high',
    replies: 18,
    upvotes: 32,
    content: 'Found suspicious alterations in climate graph being shared on social media. Charts show impossible temperature readings.',
    tags: ['climate', 'data-manipulation', 'graphs']
  }
];

const mockMessages = [
  {
    id: 1,
    user: 'Dr. Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150&h=150&fit=crop&crop=face',
    message: 'I\'ve completed initial analysis on the vaccine claims. The source appears to be a fabricated study.',
    timestamp: '10 minutes ago',
    type: 'text'
  },
  {
    id: 2,
    user: 'Mark Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    message: 'Cross-referenced with PubMed database. No matching study found. This is definitely misinformation.',
    timestamp: '8 minutes ago',
    type: 'text'
  },
  {
    id: 3,
    user: 'Dr. Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    message: 'Should we flag this for immediate takedown? It\'s spreading rapidly on multiple platforms.',
    timestamp: '5 minutes ago',
    type: 'text'
  }
];

export function CollaborationHub() {
  const [newDiscussion, setNewDiscussion] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(mockDiscussions[0]);
  const [newMessage, setNewMessage] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
          <h1 className="text-2xl font-bold">Fact-Check Collaboration Hub</h1>
          <p className="text-muted-foreground">
            Collaborate with fact-checkers worldwide using Firebase Realtime Database
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setNewDiscussion(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Discussions</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fact-Checkers Online</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cases Verified Today</p>
                <p className="text-2xl font-bold">43</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent Cases</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discussions List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Discussions</CardTitle>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search discussions..." className="pl-10" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {mockDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedDiscussion.id === discussion.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedDiscussion(discussion)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium line-clamp-2 text-sm">
                        {discussion.title}
                      </h4>
                      <div className={`text-xs font-medium ${getPriorityColor(discussion.priority)}`}>
                        {discussion.priority.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={discussion.avatar} />
                        <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{discussion.author}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{discussion.timestamp}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${getStatusColor(discussion.status)}`}>
                        {discussion.status}
                      </Badge>
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {discussion.replies}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {discussion.upvotes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Discussion Detail & Chat */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle>{selectedDiscussion.title}</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={selectedDiscussion.avatar} />
                        <AvatarFallback>{selectedDiscussion.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selectedDiscussion.author}</span>
                    </div>
                    <Badge className={getStatusColor(selectedDiscussion.status)}>
                      {selectedDiscussion.status}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {selectedDiscussion.timestamp}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Flag className="w-4 h-4 mr-2" />
                  Flag
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{selectedDiscussion.content}</p>
              
              <div className="flex flex-wrap gap-2">
                {selectedDiscussion.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {selectedDiscussion.upvotes}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    3
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedDiscussion.replies} replies
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Discussion Thread
                <Badge variant="outline" className="ml-2">
                  {mockMessages.length} messages
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {mockMessages.map((message) => (
                  <div key={message.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{message.user}</span>
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[40px] max-h-[100px]"
                />
                <Button className="self-end">
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}