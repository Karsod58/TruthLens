import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MapPin, TrendingUp, Shield, Filter, Calendar, RotateCcw, TestTube, AlertTriangle } from 'lucide-react';
import { GoogleMapsHeatmap } from '../maps/google-maps-heatmap';
import { testGoogleMapsAPI, diagnoseGoogleMaps } from '../../utils/google-maps-test';
import { toast } from 'sonner';

interface HeatmapData {
  id: string;
  lat: number;
  lng: number;
  intensity: number;
  type: string;
  count: number;
  location: string;
}

const mockHeatmapData: HeatmapData[] = [
  { id: '1', lat: 28.6139, lng: 77.2090, intensity: 0.8, type: 'phishing', count: 45, location: 'New Delhi' },
  { id: '2', lat: 19.0760, lng: 72.8777, intensity: 0.9, type: 'otp-fraud', count: 67, location: 'Mumbai' },
  { id: '3', lat: 12.9716, lng: 77.5946, intensity: 0.7, type: 'fake-promotion', count: 34, location: 'Bangalore' },
  { id: '4', lat: 13.0827, lng: 80.2707, intensity: 0.6, type: 'deepfake', count: 23, location: 'Chennai' },
  { id: '5', lat: 22.5726, lng: 88.3639, intensity: 0.8, type: 'phishing', count: 56, location: 'Kolkata' },
  { id: '6', lat: 17.3850, lng: 78.4867, intensity: 0.5, type: 'other', count: 19, location: 'Hyderabad' }
];

const scamTypes = [
  { id: 'phishing', label: 'Phishing', color: 'bg-red-500', count: 101 },
  { id: 'otp-fraud', label: 'OTP Fraud', color: 'bg-orange-500', count: 89 },
  { id: 'fake-promotion', label: 'Fake Promotion', color: 'bg-yellow-500', count: 67 },
  { id: 'deepfake', label: 'Deepfake', color: 'bg-purple-500', count: 34 },
  { id: 'other', label: 'Other', color: 'bg-gray-500', count: 45 }
];

const topLocations = [
  { city: 'Mumbai', state: 'Maharashtra', reports: 67, trend: '+12%' },
  { city: 'New Delhi', state: 'Delhi', reports: 45, trend: '+8%' },
  { city: 'Bangalore', state: 'Karnataka', reports: 34, trend: '+15%' },
  { city: 'Chennai', state: 'Tamil Nadu', reports: 23, trend: '+5%' },
  { city: 'Kolkata', state: 'West Bengal', reports: 19, trend: '+3%' }
];

export function ScamHeatmapDashboard() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['phishing', 'otp-fraud', 'fake-promotion', 'deepfake', 'other']);
  const [timeFilter, setTimeFilter] = useState('this-week');
  const [selectedPoint, setSelectedPoint] = useState<HeatmapData | null>(null);

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handlePointClick = (point: HeatmapData) => {
    setSelectedPoint(point);
    toast.info(`Selected ${point.location}: ${point.count} reports`);
  };

  const handleRefreshData = () => {
    toast.success('Refreshing heatmap data...');
    // In a real app, this would fetch fresh data
  };

  const handleTestMaps = async () => {
    toast.info('Testing Google Maps API...');
    
    // Run diagnostics first
    const diagnostics = diagnoseGoogleMaps();
    console.log('Maps diagnostics:', diagnostics);
    
    try {
      const result = await testGoogleMapsAPI();
      if (result.success) {
        toast.success('Google Maps API test passed!');
        console.log('Maps test result:', result);
      } else {
        toast.error(`Google Maps test failed: ${result.message}`);
        console.error('Maps test result:', result);
      }
    } catch (error) {
      toast.error('Maps test error - check console for details');
      console.error('Maps test error:', error);
    }
  };

  const totalReports = scamTypes.reduce((sum, type) => sum + type.count, 0);
  const topScamType = scamTypes.reduce((max, type) => type.count > max.count ? type : max);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Main Map Area */}
      <div className="flex-1 relative h-full">
        <div className="w-full h-full">
          <GoogleMapsHeatmap
            data={mockHeatmapData}
            selectedTypes={selectedTypes}
            onPointClick={handlePointClick}
          />
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white shadow-lg"
            onClick={handleRefreshData}
            title="Refresh Data"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white shadow-lg"
            onClick={handleTestMaps}
            title="Test Google Maps API"
          >
            <TestTube className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-white shadow-lg" title="Center Map">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Point Info */}
        {selectedPoint && (
          <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
            <h3 className="font-semibold text-sm mb-2">{selectedPoint.location}</h3>
            <div className="space-y-1 text-xs">
              <p><span className="font-medium">Type:</span> {scamTypes.find(t => t.id === selectedPoint.type)?.label}</p>
              <p><span className="font-medium">Reports:</span> {selectedPoint.count}</p>
              <p><span className="font-medium">Intensity:</span> {Math.round(selectedPoint.intensity * 100)}%</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-3"
              onClick={() => setSelectedPoint(null)}
            >
              Close
            </Button>
          </div>
        )}

        {/* Bottom Attribution */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow">
            Powered by Google Maps & Community Reports
          </p>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Scam Analytics</h2>
            <p className="text-sm text-gray-600">Real-time scam detection insights</p>
          </div>

          {/* Time Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Time Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Reports</span>
                <span className="font-semibold text-lg">{totalReports}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Week</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">+47</span>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Top Type</span>
                <Badge variant="outline" className="text-xs">
                  {topScamType.label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Scam Type Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scamTypes.map((type) => (
                <div key={type.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedTypes.includes(type.id)}
                      onCheckedChange={() => handleTypeToggle(type.id)}
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${type.color}`} />
                      <span className="text-sm">{type.label}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{type.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Locations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Top Affected Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topLocations.map((location, index) => (
                <div key={location.city} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{location.city}</p>
                    <p className="text-xs text-gray-500">{location.state}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{location.reports}</p>
                    <p className="text-xs text-green-600">{location.trend}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>


          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Report New Scam
            </Button>
            <Button className="w-full" variant="outline">
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}