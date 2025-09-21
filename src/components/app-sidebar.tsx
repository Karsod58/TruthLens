import React from 'react';
// Navigation will be handled by component state for this demo
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  LayoutDashboard,
  FileSearch,
  BarChart3,
  Camera,
  Users,
  Bell,
  Shield,
  User,
  LogOut,
  Eye,
  AlertTriangle,
  History,
  Map,
} from 'lucide-react';

interface AppSidebarProps {
  user: any;
  onLogout: () => void;
  currentView?: string;
  onNavigationChange?: (path: string) => void;
}

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileSearch, label: 'Analysis Results', path: '/results/latest' },
  { icon: BarChart3, label: 'Reports & Analytics', path: '/reports' },
  { icon: Camera, label: 'Media Verification', path: '/media-verification' },
  { icon: Users, label: 'Collaboration Hub', path: '/collaboration' },
  { icon: Bell, label: 'Alerts & Notifications', path: '/alerts' },
  { icon: AlertTriangle, label: 'Report Scam', path: '/scam-report' },
  { icon: History, label: 'My Reports', path: '/scam-history' },
  { icon: Map, label: 'Scam Heatmap', path: '/scam-heatmap' },
  { icon: Shield, label: 'Admin Panel', path: '/admin' },
  { icon: User, label: 'Profile & Settings', path: '/profile' },
];

export function AppSidebar({ user, onLogout, currentView = '/dashboard', onNavigationChange }: AppSidebarProps) {
  const handleItemClick = (path: string) => {
    if (onNavigationChange) {
      onNavigationChange(path);
    }
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">TruthLens</h1>
            <p className="text-sm text-muted-foreground">AI Misinformation Detection</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                onClick={() => handleItemClick(item.path)}
                isActive={currentView === item.path}
                className="w-full justify-start gap-3 px-3 py-3 hover:bg-accent"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}