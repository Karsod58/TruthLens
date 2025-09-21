import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Eye, Shield, Zap, Users, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { supabase } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://zuxisavlaxiywcingyyb.supabase.co/auth/v1/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message?.includes('400')) {
          toast.error('OAuth configuration error. Please check Google OAuth settings.');
        } else if (error.message?.includes('403')) {
          toast.error('Google OAuth access denied. Please check OAuth permissions.');
        } else if (error.message?.includes('malformed')) {
          toast.error('OAuth request malformed. Please check configuration.');
        } else {
          toast.error(`Google sign-in failed: ${error.message}`);
        }
        setIsLoading(false);
        return;
      }

      // For redirect flow, the user will be redirected
      // The auth state change will be handled in App.tsx
      if (data?.url) {
        // The redirect will happen automatically
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error(`Google sign-in failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockUser = {
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@truthlens.demo',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and features */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">TruthLens</h1>
                <p className="text-gray-600">AI-Powered Misinformation Detection</p>
              </div>
            </div>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              Harness the power of Google Cloud AI to detect misinformation, 
              verify media authenticity, and collaborate with fact-checkers worldwide.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Real-time Analysis</h3>
                <p className="text-gray-600">Powered by Vertex AI and Natural Language API for instant results</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Media Verification</h3>
                <p className="text-gray-600">Detect deepfakes and manipulated content using Cloud Vision API</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Collaborative Platform</h3>
                <p className="text-gray-600">Connect with fact-checkers and share insights in real-time</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop"
              alt="AI Technology Illustration"
              className="w-full h-48 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl">Welcome to TruthLens</CardTitle>
              <CardDescription>
                Sign in to start detecting misinformation and verifying content
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center space-x-3"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              <Button 
                onClick={handleDemoSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full py-3 flex items-center justify-center space-x-2"
                size="lg"
              >
                <span>Try Demo Account</span>
              </Button>

              <div className="text-center space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Mode Active</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Google OAuth configuration in progress. Using demo credentials for development.
                  </p>
                </div>
                <div className="flex justify-center space-x-4 text-xs text-gray-500">
                  <span>Privacy Policy</span>
                  <span>•</span>
                  <span>Terms of Service</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}
