import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Filter, Mail, Phone, FileText, Smartphone, CreditCard, Eye } from 'lucide-react';

interface ScamReport {
  id: string;
  type: string;
  title: string;
  date: string;
  status: 'pending' | 'reviewed' | 'flagged' | 'resolved';
  description: string;
  evidenceCount: number;
}

const mockReports: ScamReport[] = [
  {
    id: '1',
    type: 'phishing',
    title: 'Fake Bank Email',
    date: '2024-01-15',
    status: 'flagged',
    description: 'Received suspicious email claiming to be from my bank asking for account details.',
    evidenceCount: 2
  },
  {
    id: '2',
    type: 'otp-fraud',
    title: 'OTP Fraud Call',
    date: '2024-01-12',
    status: 'reviewed',
    description: 'Someone called pretending to be from telecom company asking for OTP.',
    evidenceCount: 1
  },
  {
    id: '3',
    type: 'fake-promotion',
    title: 'Fake Lottery Win',
    date: '2024-01-10',
    status: 'pending',
    description: 'SMS claiming I won a lottery prize worth ₹50,000.',
    evidenceCount: 3
  },
  {
    id: '4',
    type: 'deepfake',
    title: 'Deepfake Video',
    date: '2024-01-08',
    status: 'resolved',
    description: 'Found a deepfake video of a celebrity endorsing crypto scam.',
    evidenceCount: 1
  },
  {
    id: '5',
    type: 'other',
    title: 'Investment Scam',
    date: '2024-01-05',
    status: 'reviewed',
    description: 'WhatsApp group promoting fake investment scheme.',
    evidenceCount: 4
  }
];

const scamTypeIcons = {
  phishing: Mail,
  'otp-fraud': Phone,
  'fake-promotion': CreditCard,
  deepfake: Eye,
  other: FileText
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  reviewed: 'bg-blue-100 text-blue-800 border-blue-300',
  flagged: 'bg-red-100 text-red-800 border-red-300',
  resolved: 'bg-green-100 text-green-800 border-green-300'
};

export function ScamReportHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">My Reports</h1>
        <p className="text-muted-foreground">Track your scam reports and their review status</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="phishing">Phishing</SelectItem>
                <SelectItem value="otp-fraud">OTP Fraud</SelectItem>
                <SelectItem value="fake-promotion">Fake Promotion</SelectItem>
                <SelectItem value="deepfake">Deepfake</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or create a new report.</p>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => {
            const IconComponent = scamTypeIcons[report.type as keyof typeof scamTypeIcons];
            
            return (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{report.title}</h3>
                          <Badge className={statusColors[report.status]}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {report.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatDate(report.date)}</span>
                          <span>•</span>
                          <span>{report.evidenceCount} evidence file{report.evidenceCount !== 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span className="capitalize">{report.type.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {filteredReports.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Showing {filteredReports.length} of {mockReports.length} reports
          </p>
        </div>
      )}
    </div>
  );
}