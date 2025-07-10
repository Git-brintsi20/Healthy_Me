# HealthyME 🥗

> An AI-powered nutrition facts and myth-busting web application .
> Clarity in every Calorie. Bust all your diet myths with HealthyMe.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Google Cloud AI](https://img.shields.io/badge/Google%20Cloud-AI-blue?style=flat-square&logo=google-cloud)](https://cloud.google.com/ai)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

## 🎯 Project Overview

HealthyME is a comprehensive web application that leverages Google Cloud AI technologies to provide accurate nutrition information and debunk common nutrition myths. Built with modern web technologies and designed for scalability and user experience.

## ✨ Features

- **🔍 Nutrition Analysis**: AI-powered nutrition facts lookup and analysis
- **🎭 Myth Busting**: Science-based debunking of common nutrition myths
- **🖼️ Image Recognition**: Analyze food images for nutritional content
- **📊 Data Visualization**: Interactive charts and nutritional insights
- **👤 User Profiles**: Personalized nutrition tracking and history
- **🔐 Secure Authentication**: Firebase-based user management
- **📱 Progressive Web App**: Responsive design with offline capabilities
- **⚡ Real-time Updates**: Live data synchronization with Firestore

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **UI Components**: Custom component library with design system
- **Charts**: Recharts for data visualization
- **PWA**: Manifest and service worker configuration

### Backend & AI
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI/ML**: Google Cloud AI stack
  - Gemini API for text analysis
  - Vertex AI for advanced processing
  - AI Studio for workflow integration
- **Hosting**: Firebase Hosting

### Development Tools
- **Language**: TypeScript
- **Validation**: Zod schemas
- **State Management**: React hooks + Context API
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
healthy_me/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # User dashboard
│   │   ├── (admin)/           # Admin panel
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── features/          # Feature-specific components
│   │   ├── forms/             # Form components
│   │   └── layout/            # Layout components
│   ├── lib/                   # Utility libraries
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Helper functions
├── public/                    # Static assets
└── configuration files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Firebase project with Firestore enabled
- Google Cloud AI API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthy-me.git
   cd healthy-me
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Configure Firebase**
   - Create a Firebase project
   - Enable Firestore and Authentication
   - Add your Firebase config to `.env.local`

5. **Setup Google Cloud AI**
   - Enable required APIs in Google Cloud Console
   - Generate API keys for Gemini and Vertex AI
   - Add keys to `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)**

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config

# Google Cloud AI
GEMINI_API_KEY=your_gemini_api_key
VERTEX_AI_PROJECT_ID=your-vertex-project-id
# ... other AI config
```

### Database Setup

1. **Firestore Rules**: Deploy security rules
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Initial Data**: The app will create necessary collections on first run

## 🎨 Design System

HealthyME uses a comprehensive design system built with Tailwind CSS:

- **Color Palette**: Carefully selected colors for accessibility
- **Typography**: Responsive font scaling with semantic hierarchy
- **Components**: Consistent component library with variants
- **Dark Mode**: Full dark mode support with theme switching

## 📊 Features Overview

### Core Features
- **Nutrition Search**: Look up nutrition facts for any food item
- **Myth Verification**: Get science-based answers to nutrition questions
- **Image Analysis**: Upload food images for instant nutritional analysis
- **Personal Dashboard**: Track your nutrition queries and favorites

### Admin Features
- **User Management**: Monitor and manage user accounts
- **Content Moderation**: Review and approve user-generated content
- **Analytics Dashboard**: Track app usage and performance metrics
- **System Configuration**: Manage app settings and configurations

## 🔐 Security Features

- **Authentication**: Secure user authentication with Firebase Auth
- **Data Protection**: Firestore security rules for data access control
- **API Security**: Rate limiting and input validation on all endpoints
- **Admin Access**: Role-based access control for admin features

## 🚀 Deployment

### Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Environment-Specific Deployments

- **Development**: Automatic deployment on push to `develop` branch
- **Production**: Manual deployment from `main` branch

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

While primarily a student project, contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎓 Educational Context

This project was developed as part of academic coursework and hackathon participation, focusing on:
- Modern web development practices
- AI/ML integration in web applications
- Cloud-native application architecture
- User experience design
- Full-stack development skills

## 🙏 Acknowledgments

- **Google Cloud AI** for providing powerful AI APIs
- **Firebase** for backend infrastructure
- **Next.js** team for the excellent framework
- **shadcn/ui** for beautiful UI components

## 📚 Learning Resources

Resources that helped in building this project:
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Cloud AI Documentation](https://cloud.google.com/ai/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

⭐ **Star this repository if you found it helpful!** ⭐

