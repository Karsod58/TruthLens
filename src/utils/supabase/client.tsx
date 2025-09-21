import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton Supabase client
const supabase = createSupabaseClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Export the singleton client
export { supabase };

// Helper function to get the current user session
export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return session?.user || null;
}

// Helper function to get the access token
export async function getAccessToken() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting access token:', error);
    return null;
  }
  return session?.access_token || null;
}

// API helper functions for making requests to our server
export class TruthLensAPI {
  private static baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-76a6fe9f`;

  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = await getAccessToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || publicAnonKey}`,
      ...options.headers
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  static async signup(email: string, password: string, name: string) {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  }

  static async getProfile() {
    return this.makeRequest('/auth/profile');
  }

  static async updateProfile(updates: any) {
    return this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Analysis endpoints
  static async analyzeContent(content: string, url?: string, type?: string) {
    return this.makeRequest('/analysis/analyze', {
      method: 'POST',
      body: JSON.stringify({ content, url, type })
    });
  }

  static async getAnalysis(id: string) {
    return this.makeRequest(`/analysis/${id}`);
  }

  static async getRecentAnalyses() {
    return this.makeRequest('/analysis/recent');
  }

  // File upload
  static async uploadFile(file: File, bucket?: string) {
    const token = await getAccessToken();
    const formData = new FormData();
    formData.append('file', file);
    if (bucket) formData.append('bucket', bucket);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token || publicAnonKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || 'Upload failed');
    }

    return response.json();
  }

  // Scam reports
  static async submitScamReport(report: any) {
    return this.makeRequest('/scam-reports', {
      method: 'POST',
      body: JSON.stringify(report)
    });
  }

  static async getScamReports() {
    return this.makeRequest('/scam-reports');
  }

  static async getScamStatistics() {
    return this.makeRequest('/scam-reports/statistics');
  }

  // Dashboard
  static async getDashboardStats() {
    return this.makeRequest('/dashboard/stats');
  }

  // Collaboration
  static async getMessages() {
    return this.makeRequest('/collaboration/messages');
  }

  static async sendMessage(message: string, type?: string) {
    return this.makeRequest('/collaboration/messages', {
      method: 'POST',
      body: JSON.stringify({ message, type })
    });
  }

  // Admin endpoints
  static async getAdminReports() {
    return this.makeRequest('/admin/reports');
  }

  static async updateReportStatus(id: string, status: string, priority: string) {
    return this.makeRequest(`/admin/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, priority })
    });
  }
}