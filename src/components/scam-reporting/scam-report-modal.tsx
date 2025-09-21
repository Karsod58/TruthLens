import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Upload, Camera, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ScamReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const scamTypes = [
  { value: 'otp-fraud', label: 'OTP Fraud', icon: '📱' },
  { value: 'phishing', label: 'Phishing', icon: '🎣' },
  { value: 'deepfake', label: 'Deepfake', icon: '🎭' },
  { value: 'fake-promotion', label: 'Fake Promotion', icon: '🏷️' },
  { value: 'other', label: 'Other', icon: '❓' }
];

export function ScamReportModal({ open, onOpenChange }: ScamReportModalProps) {
  const [scamType, setScamType] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!scamType) {
      toast.error('Please select a scam type');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Scam report submitted successfully! Our team will review it shortly.');
    
    // Reset form
    setScamType('');
    setDescription('');
    setFiles([]);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Report a Scam
          </DialogTitle>
          <DialogDescription>
            Help others stay safe by reporting this scam.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="scam-type">Select Scam Type *</Label>
            <Select value={scamType} onValueChange={setScamType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose scam type..." />
              </SelectTrigger>
              <SelectContent>
                {scamTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Describe what happened (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the scam incident..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label>Attach Evidence</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <Camera className="h-5 w-5" />
                  <FileText className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-600">Upload screenshots, documents, or other evidence</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Uploaded files:</p>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? 'Reporting...' : 'Report Now'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}