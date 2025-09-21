import React, { useState, useEffect } from 'react';
import { SidebarProvider } from './components/ui/sidebar';
import { Toaster } from './components/ui/sonner';
import { AppSidebar } from './components/app-sidebar';
import { TopBar } from './components/top-bar';
import { LoginPage } from './components/auth/login-page';
import { Dashboard } from './components/dashboard/dashboard';
import { DetailedResult } from './components/results/detailed-result';
import { ReportsAnalytics } from './components/reports/reports-analytics';
import { MediaVerification } from './components/media/media-verification';
import { CollaborationHub } from './components/collaboration/collaboration-hub';
import { AlertsNotifications } from './components/alerts/alerts-notifications';
import { AdminPanel } from './components/admin/admin-panel';
import { ProfileSettings } from './components/profile/profile-settings';
import { ScamReportModal } from './components/scam-reporting/scam-report-modal';
import { ScamReportHistory } from './components/scam-reporting/scam-report-history';
import { ScamHeatmapDashboard } from './components/scam-reporting/scam-heatmap-dashboard';
import { TestIcons } from './components/test-icons';
import { supabase } from './utils/supabase/client';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('/dashboard');
  const [showScamReportModal, setShowScamReportModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
        }
        
        if (session?.user) {
          const userData = {
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email,
            avatar: session.user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          };
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Handle OAuth callback
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('OAuth callback error:', error);
          toast.error('Authentication failed. Please try again.');
          return;
        }
        
        if (data.session?.user) {
          const userData = {
            name: data.session.user.user_metadata.full_name || data.session.user.email?.split('@')[0] || 'User',
            email: data.session.user.email,
            avatar: data.session.user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          };
          setUser(userData);
          setIsAuthenticated(true);
          toast.success('Successfully signed in with Google!');
        }
      } catch (error) {
        console.error('OAuth callback handling error:', error);
        toast.error('Authentication callback failed.');
      }
    };

    // Check if this is an OAuth callback (Supabase handles this automatically)
    // The callback URL is: https://zuxisavlaxiywcingyyb.supabase.co/auth/v1/callback
    // Supabase will redirect back to our app after authentication
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = {
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          avatar: session.user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleNavigationChange = (path: string) => {
    if (path === '/scam-report') {
      setShowScamReportModal(true);
    } else {
      setCurrentView(path);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case '/dashboard':
        return <Dashboard />;
      case '/results/latest':
        return <DetailedResult />;
      case '/reports':
        return <ReportsAnalytics />;
      case '/media-verification':
        return <MediaVerification />;
      case '/collaboration':
        return <CollaborationHub />;
      case '/alerts':
        return <AlertsNotifications />;
      case '/scam-history':
        return <ScamReportHistory />;
      case '/scam-heatmap':
        return <ScamHeatmapDashboard />;
      case '/admin':
        return <AdminPanel />;
      case '/profile':
        return <ProfileSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading TruthLens...</p>
          <p className="text-xs text-gray-400">Check console for OAuth domain URLs</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar 
          user={user} 
          onLogout={handleLogout}
          currentView={currentView}
          onNavigationChange={handleNavigationChange}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentView !== '/scam-heatmap' && <TopBar user={user} />}
          <main className={`flex-1 overflow-y-auto ${currentView !== '/scam-heatmap' ? 'bg-gray-50' : ''}`}>
            {renderCurrentView()}
          </main>
        </div>
      </div>
      <ScamReportModal 
        open={showScamReportModal} 
        onOpenChange={setShowScamReportModal} 
      />
      <Toaster />
    </SidebarProvider>
  );
}