# TruthLens

A comprehensive misinformation detection and analysis platform built with React, TypeScript, and modern web technologies. TruthLens helps users identify, analyze, and understand misinformation through AI-powered analysis, interactive visualizations, and educational content generation.

## 🚀 Features

### 🔍 **AI-Powered Analysis**
- **Content Verification**: Analyze text, images, and media for misinformation
- **Truth Score Meter**: Real-time credibility assessment with detailed breakdowns
- **Voice Input**: Speech-to-text analysis for audio content
- **Multi-language Support**: Analysis in multiple languages with translation

### 🗺️ **Interactive Visualizations**
- **Google Maps Integration**: Heatmap visualization of scam reports and misinformation hotspots
- **Real-time Data**: Live updates on misinformation trends and patterns
- **Geographic Analysis**: Location-based analysis of misinformation spread

### 🎥 **Video Generation**
- **Educational Content**: Generate educational videos from analysis results
- **Multiple Templates**: Choose from various video styles (educational, dramatic, news, social media)
- **Customizable Options**: Duration, quality, language, and subtitle preferences
- **Preview & Download**: Real-time preview and download capabilities

### 🔐 **Authentication & Security**
- **Google OAuth**: Secure sign-in with Google authentication
- **User Profiles**: Personalized user experience and settings
- **Secure API**: Protected endpoints with proper authentication

### 📊 **Analytics & Reporting**
- **Scam Reporting**: Report and track misinformation incidents
- **Analytics Dashboard**: Comprehensive insights and statistics
- **Report History**: Track and manage previous reports
- **Collaboration Hub**: Team collaboration features

## 🛠️ **Technology Stack**

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **Maps**: Google Maps JavaScript API
- **Authentication**: Supabase Auth
- **AI Services**: Google Cloud AI (Gemini, Speech-to-Text, Translation)
- **Backend**: Supabase Edge Functions with Hono
- **State Management**: React Hooks
- **Styling**: Tailwind CSS with custom components

## 📋 **Prerequisites**

Before running this project, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Google Cloud Console** account with APIs enabled
- **Supabase** account and project

## ⚙️ **Setup Instructions**

### 1. Clone the Repository
```bash
git clone https://github.com/Karsod58/TruthLens.git
cd TruthLens
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the environment template and configure your API keys:

```bash
cp .env.example .env
```

Update `.env` with your actual API keys:

```env
# Google Cloud API Keys
VITE_GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Development Environment
NODE_ENV=development
```

### 4. Google Cloud Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Maps Visualization API
   - Gemini API
   - Speech-to-Text API
   - Translation API
4. Create API keys and add them to your `.env` file

### 5. Supabase Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings → API to get your project URL and anon key
4. Go to Authentication → Providers and enable Google OAuth
5. Add your Google OAuth credentials
6. Set redirect URL to: `https://your-project-id.supabase.co/auth/v1/callback`

### 6. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## 🎯 **Usage Guide**

### **Getting Started**
1. **Sign In**: Use Google OAuth to authenticate
2. **Dashboard**: Access the main dashboard with analysis tools
3. **Content Analysis**: Upload or input content for verification
4. **View Results**: Get detailed analysis with truth scores and explanations

### **Content Analysis**
1. **Text Analysis**: Paste text content for AI analysis
2. **Voice Input**: Use speech-to-text for audio content
3. **Image Analysis**: Upload images for visual content verification
4. **Translation**: Translate content for multi-language analysis

### **Video Generation**
1. **Generate Story**: Create educational content from analysis
2. **Select Template**: Choose from available video templates
3. **Customize Options**: Set duration, quality, and language preferences
4. **Preview & Download**: Review and download generated videos

### **Scam Reporting**
1. **Report Incidents**: Submit misinformation reports
2. **View Heatmap**: See geographic distribution of reports
3. **Track Trends**: Monitor misinformation patterns over time
4. **Collaborate**: Work with team members on reports

## 🔧 **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📁 **Project Structure**

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── maps/           # Google Maps components
│   ├── media/          # Media verification components
│   ├── video/          # Video generation components
│   └── ui/             # Reusable UI components
├── services/           # API services and utilities
├── utils/              # Helper functions
├── supabase/           # Backend functions
└── styles/             # Global styles
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Karsod58/TruthLens/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🔮 **Roadmap**

- [ ] Mobile app development
- [ ] Advanced AI models integration
- [ ] Real-time collaboration features
- [ ] API rate limiting and optimization
- [ ] Advanced analytics and reporting
- [ ] Multi-tenant support

---

**TruthLens** - Empowering users to identify and combat misinformation through technology and education.