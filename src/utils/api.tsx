import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-76a6fe9f`;

class ApiClient {
  private getAuthHeaders(accessToken?: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken || publicAnonKey}`
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}, accessToken?: string) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getAuthHeaders(accessToken);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication
  async signup(email: string, password: string, name: string) {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  }

  // Profile Management
  async getProfile(accessToken: string) {
    return this.makeRequest('/profile', { method: 'GET' }, accessToken);
  }

  async updateProfile(updates: any, accessToken: string) {
    return this.makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    }, accessToken);
  }

  // Analysis
  async analyzeContent(content: string, type: string, url?: string, accessToken?: string) {
    return this.makeRequest('/analyze', {
      method: 'POST',
      body: JSON.stringify({ content, type, url })
    }, accessToken);
  }

  async getAnalyses(accessToken: string) {
    return this.makeRequest('/analyses', { method: 'GET' }, accessToken);
  }

  async getAnalysis(id: string, accessToken: string) {
    return this.makeRequest(`/analysis/${id}`, { method: 'GET' }, accessToken);
  }

  // Scam Reporting
  async submitScamReport(reportData: any, accessToken: string) {
    return this.makeRequest('/scam-reports', {
      method: 'POST',
      body: JSON.stringify(reportData)
    }, accessToken);
  }

  async getScamReports(accessToken: string) {
    return this.makeRequest('/scam-reports', { method: 'GET' }, accessToken);
  }

  // Media Upload
  async uploadMedia(file: File, accessToken: string) {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }
      return response.json();
    });
  }

  // Collaboration
  async getCollaborations(accessToken: string) {
    return this.makeRequest('/collaborations', { method: 'GET' }, accessToken);
  }

  // Notifications
  async getNotifications(accessToken: string) {
    return this.makeRequest('/notifications', { method: 'GET' }, accessToken);
  }

  // Admin
  async getAdminStats(accessToken: string) {
    return this.makeRequest('/admin/stats', { method: 'GET' }, accessToken);
  }

  // Analytics
  async getDashboardAnalytics(accessToken: string) {
    return this.makeRequest('/analytics/dashboard', { method: 'GET' }, accessToken);
  }
}

export const apiClient = new ApiClient();