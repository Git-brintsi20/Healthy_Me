# HealthyME 🥗

> AI-powered nutrition analysis and myth-busting platform that brings clarity to every calorie and debunks diet myths with science-backed insights.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Google Cloud AI](https://img.shields.io/badge/Google%20Cloud-AI-blue?style=flat-square&logo=google-cloud)](https://cloud.google.com/ai)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat-square)](https://web.dev/progressive-web-apps/)

**🌐 Live Demo:** [healthyme.app](https://your-deployed-url.web.app) *(Update after deployment)*

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Screenshots](#-screenshots)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Core Features Explained](#-core-features-explained)
- [API Integration](#-api-integration)
- [Progressive Web App](#-progressive-web-app)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Performance Optimizations](#-performance-optimizations)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

HealthyME is a comprehensive nutrition and wellness platform that leverages cutting-edge AI technology to help users make informed dietary decisions. Built with Next.js 14 and Google Cloud AI, it provides real-time nutritional analysis, evidence-based myth-busting, and personalized health insights.

### 🌟 Why HealthyME?

In an era of nutrition misinformation, HealthyME stands out by:
- **AI-Powered Analysis**: Using Google Gemini API and Vertex AI for accurate food recognition and nutritional breakdown
- **Science-Backed Insights**: Every myth debunked with cited scientific sources
- **Offline-First Design**: Progressive Web App with service worker caching for uninterrupted access
- **Privacy-Focused**: All data encrypted and stored securely in Firebase Firestore
- **Modern UX**: Built with shadcn/ui for beautiful, accessible components

---

## ✨ Key Features

### 🔍 **Nutrition Analysis**
- **Text-based Search**: Search any food item and get complete nutritional breakdown
- **Image Recognition**: Upload/capture food photos for instant AI-powered analysis
- **Detailed Macros**: Calories, proteins, carbs, fats, vitamins, minerals
- **Portion Control**: Adjust serving sizes and see updated nutritional values
- **Meal Logging**: Track daily intake with automatic calorie calculation
- **Export Reports**: Download nutrition reports as PDF

### 🎭 **Myth Busting**
- **Ask Anything**: Submit any nutrition/diet myth or question
- **AI-Powered Verification**: Gemini API analyzes claims against scientific literature
- **Source Attribution**: Every answer includes credible sources and research citations
- **Community Q&A**: Browse previously answered myths
- **Myth Categories**: Diet trends, supplements, weight loss, sports nutrition
- **Save Favorites**: Bookmark useful myth debunks for later

### 🖼️ **Image Analysis** *(Google Cloud Vision AI)*
- **Food Recognition**: Identify food items from photos
- **Multi-item Detection**: Recognize multiple foods in a single image
- **Confidence Scores**: See AI confidence levels for each detection
- **Nutritional Estimates**: Get approximate nutrition based on visual portion sizes
- **Recipe Recognition**: Upload recipe photos and get ingredient-wise breakdown

### 📊 **Data Visualization**
- **Interactive Charts**: Recharts-powered visualizations for macro breakdown
- **Daily Tracking**: Line charts showing calorie intake over time
- **Goal Progress**: Visual indicators for nutrition goals (protein, calories, etc.)
- **Comparative Analysis**: Compare foods side-by-side with bar charts
- **Weekly Summaries**: Aggregate nutrition data with trend analysis

### 👤 **User Features**
- **Personal Dashboard**: Centralized view of all nutrition activities
- **Search History**: Quick access to previously searched foods
- **Favorites System**: Save frequently consumed foods
- **Custom Goals**: Set personalized calorie and macro targets
- **Achievements**: Unlock badges for consistent tracking
- **Meal Plans**: AI-suggested meal plans based on goals (future feature)

### 🔐 **Authentication & Security**
- **Firebase Authentication**: Secure email/password and social logins
- **Email Verification**: Mandatory email verification for new accounts
- **Password Reset**: Secure password recovery flow
- **Session Management**: Automatic logout on inactivity
- **Role-Based Access**: User/Admin roles with different permissions

### 📱 **Progressive Web App (PWA)**
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Service worker caching for offline functionality
- **Push Notifications**: Reminders for meal logging (if enabled)
- **Background Sync**: Queue requests when offline, sync when back online
- **App-like Experience**: Native app feel with smooth animations

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router | 14.x |
| **TypeScript** | Type-safe development | 5.x |
| **Tailwind CSS** | Utility-first CSS framework | 3.x |
| **shadcn/ui** | Accessible component library | Latest |
| **Recharts** | Data visualization library | 2.x |
| **React Hook Form** | Form state management | 7.x |
| **Zod** | Schema validation | 3.x |

### **Backend & AI**
| Technology | Purpose |
|------------|---------|
| **Firebase Firestore** | NoSQL database for user data, history, favorites |
| **Firebase Auth** | User authentication and session management |
| **Firebase Storage** | Image uploads and storage |
| **Google Gemini API** | AI text generation for myth-busting and analysis |
| **Vertex AI** | Advanced AI processing for complex queries |
| **Google Cloud Vision** | Image recognition and food detection |

### **DevOps & Tooling**
| Tool | Purpose |
|------|---------|
| **Firebase Hosting** | Serverless static hosting with CDN |
| **GitHub Actions** | CI/CD pipeline for automated deployment |
| **Vercel** | Alternative hosting option for Next.js |
| **ESLint + Prettier** | Code quality and formatting |
| **Jest + RTL** | Unit and integration testing |

---

## 📸 Screenshots

### Landing Page
![Landing Page](./docs/screenshots/landing.png)
*Hero section with clear value proposition and CTA*

### Nutrition Search
![Nutrition Search](./docs/screenshots/nutrition-search.png)
*Real-time search with autocomplete and instant results*

### Food Analysis Results
![Analysis Results](./docs/screenshots/analysis-results.png)
*Detailed nutritional breakdown with macros visualization*

### Image Upload & Recognition
![Image Upload](./docs/screenshots/image-upload.png)
*Drag-and-drop interface with AI-powered food detection*

### Myth Busting Interface
![Myth Busting](./docs/screenshots/myth-busting.png)
*Ask questions and get science-backed answers with sources*

### User Dashboard
![Dashboard](./docs/screenshots/dashboard.png)
*Personalized dashboard with recent searches and favorites*

### Mobile PWA
![Mobile View](./docs/screenshots/mobile-pwa.png)
*Responsive design with native app-like experience*

---

## 🏗️ Architecture

### System Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Next.js 14 (App Router)                     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Pages    │  │ Components │  │   Hooks    │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │         Service Worker (PWA)                   │  │  │
│  │  │  - Offline caching                             │  │  │
│  │  │  - Background sync                             │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      FIREBASE BACKEND                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Firestore  │  │ Firebase Auth│  │Firebase Storage│     │
│  │  (Database)  │  │(Authentication)│ │(Image Storage) │    │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ API Calls
┌─────────────────────────────────────────────────────────────┐
│                   GOOGLE CLOUD AI STACK                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Gemini API  │  │  Vertex AI   │  │ Vision API   │      │
│  │(Text Analysis)│  │(Advanced ML) │  │(Image Recog) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → Next.js Frontend
2. **Frontend** → Firebase Auth (if authentication needed)
3. **Frontend** → Gemini API / Vision API (for AI processing)
4. **AI Response** → Frontend (display results)
5. **Frontend** → Firestore (save to user history/favorites)
6. **Service Worker** → Cache responses for offline access

---

## 📁 Project Structure
```
healthy-me/
├── src/
│   ├── app/                           # Next.js 14 App Router
│   │   ├── (auth)/                    # Authentication group
│   │   │   ├── login/                 # Login page
│   │   │   ├── register/              # Registration page
│   │   │   └── reset-password/        # Password reset
│   │   ├── (dashboard)/               # Protected routes group
│   │   │   ├── dashboard/             # User dashboard
│   │   │   ├── nutrition/             # Nutrition search
│   │   │   ├── myths/                 # Myth-busting interface
│   │   │   ├── history/               # Search history
│   │   │   └── favorites/             # Saved favorites
│   │   ├── api/                       # API routes
│   │   │   ├── analyze/               # Food analysis endpoint
│   │   │   ├── myth-bust/             # Myth verification endpoint
│   │   │   └── image-upload/          # Image processing endpoint
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Landing page
│   │   └── globals.css                # Global styles
│   │
│   ├── components/                    # React components
│   │   ├── ui/                        # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (other shadcn components)
│   │   ├── features/                  # Feature-specific components
│   │   │   ├── nutrition/
│   │   │   │   ├── NutritionCard.tsx
│   │   │   │   ├── MacroChart.tsx
│   │   │   │   └── SearchBar.tsx
│   │   │   ├── myths/
│   │   │   │   ├── MythCard.tsx
│   │   │   │   └── SourceCitation.tsx
│   │   │   └── dashboard/
│   │   │       ├── RecentSearches.tsx
│   │   │       └── StatsOverview.tsx
│   │   ├── forms/                     # Form components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── FoodSearchForm.tsx
│   │   └── layout/                    # Layout components
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   │
│   ├── lib/                           # Core utilities
│   │   ├── firebase/                  # Firebase configuration
│   │   │   ├── config.ts              # Firebase initialization
│   │   │   ├── auth.ts                # Auth helpers
│   │   │   ├── firestore.ts           # Firestore helpers
│   │   │   └── storage.ts             # Storage helpers
│   │   ├── ai/                        # AI integrations
│   │   │   ├── gemini.ts              # Gemini API client
│   │   │   ├── vertex.ts              # Vertex AI client
│   │   │   └── vision.ts              # Vision API client
│   │   ├── utils.ts                   # General utilities
│   │   └── constants.ts               # App constants
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAuth.ts                 # Authentication hook
│   │   ├── useNutrition.ts            # Nutrition data hook
│   │   ├── useMyths.ts                # Myth-busting hook
│   │   ├── useFirestore.ts            # Firestore operations hook
│   │   └── useImageUpload.ts          # Image upload hook
│   │
│   ├── types/                         # TypeScript definitions
│   │   ├── nutrition.ts               # Nutrition data types
│   │   ├── user.ts                    # User types
│   │   ├── myth.ts                    # Myth types
│   │   └── api.ts                     # API response types
│   │
│   ├── contexts/                      # React contexts
│   │   ├── AuthContext.tsx            # Auth context provider
│   │   └── ThemeContext.tsx           # Theme context (dark mode)
│   │
│   ├── middleware.ts                  # Next.js middleware (auth protection)
│   └── utils/                         # Helper functions
│       ├── validation.ts              # Zod schemas
│       ├── formatting.ts              # Data formatting
│       └── api-helpers.ts             # API utilities
│
├── public/                            # Static assets
│   ├── icons/                         # App icons for PWA
│   ├── images/                        # Static images
│   ├── manifest.json                  # PWA manifest
│   └── sw.js                          # Service worker
│
├── docs/                              # Documentation
│   ├── screenshots/                   # App screenshots
│   ├── API.md                         # API documentation
│   └── DEPLOYMENT.md                  # Deployment guide
│
├── .env.local.example                 # Environment variables template
├── .eslintrc.json                     # ESLint configuration
├── .prettierrc                        # Prettier configuration
├── next.config.js                     # Next.js configuration
├── tailwind.config.ts                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies
├── firebase.json                      # Firebase configuration
└── README.md                          # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Firebase account** ([Sign up](https://firebase.google.com/))
- **Google Cloud account** with billing enabled ([Sign up](https://cloud.google.com/))
- **Git** for version control

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/healthy-me.git
cd healthy-me
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Firebase Setup

**Create Firebase Project:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the wizard
3. Enable **Firestore**, **Authentication**, and **Storage**

**Get Firebase Configuration:**
1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Click "Add app" → Web
4. Copy the configuration object

**Set Firestore Rules:**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Nutrition history - private to user
    match /nutrition_history/{userId}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Myths - public read, authenticated write
    match /myths/{mythId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

#### 4. Google Cloud AI Setup

**Enable APIs:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable these APIs:
   - Gemini API (Generative AI)
   - Vertex AI API
   - Cloud Vision API

**Create API Keys:**
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → API Key
3. Restrict the key to your specific APIs
4. Copy the API key

#### 5. Environment Configuration

Create `.env.local` file in root directory:
```env
# ===================================
# Firebase Configuration
# ===================================
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ===================================
# Google Cloud AI Configuration
# ===================================
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key  # For client-side calls
VERTEX_AI_PROJECT_ID=your-vertex-project-id
VERTEX_AI_LOCATION=us-central1
GOOGLE_CLOUD_VISION_API_KEY=your_vision_api_key

# ===================================
# Application Configuration
# ===================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ===================================
# Optional: Analytics & Monitoring
# ===================================
NEXT_PUBLIC_GA_ID=your_google_analytics_id  # Optional
```

**Create `.env.local.example`** (for GitHub - without sensitive values):
```env
# HealthyME - Complete Documentation

## Environment Configuration

### Copy this file to .env.local and fill in your actual values

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Cloud AI
GEMINI_API_KEY=
NEXT_PUBLIC_GEMINI_API_KEY=
VERTEX_AI_PROJECT_ID=
VERTEX_AI_LOCATION=us-central1
GOOGLE_CLOUD_VISION_API_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Getting Started

### 6. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser.

### 7. Build for Production

```bash
npm run build
npm start
```

## 🎯 Core Features Explained

### 1. Nutrition Analysis with Gemini API

#### How It Works:

1. User enters food name (e.g., "Grilled Chicken Breast")
2. Frontend sends request to /api/analyze with food name
3. API route calls Gemini API with structured prompt
4. Gemini returns detailed nutritional breakdown
5. Data is parsed, validated with Zod, and returned
6. Frontend displays results with Recharts visualization
7. User can save to history or favorites (stored in Firestore)

#### Example API Route (src/app/api/analyze/route.ts):

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const NutritionSchema = z.object({
  name: z.string(),
  servingSize: z.string(),
  calories: z.number(),
  macros: z.object({
    protein: z.number(),
    carbs: z.number(),
    fats: z.number(),
    fiber: z.number(),
  }),
  vitamins: z.array(z.object({
    name: z.string(),
    amount: z.string(),
    dailyValue: z.number(),
  })),
  minerals: z.array(z.object({
    name: z.string(),
    amount: z.string(),
    dailyValue: z.number(),
  })),
});

export async function POST(request: Request) {
  try {
    const { foodName, servingSize } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Provide detailed nutritional information for: ${foodName}
      Serving size: ${servingSize || "100g"}
      
      Return ONLY a valid JSON object with this exact structure:
      {
        "name": "food name",
        "servingSize": "serving size",
        "calories": number,
        "macros": {
          "protein": number (in grams),
          "carbs": number (in grams),
          "fats": number (in grams),
          "fiber": number (in grams)
        },
        "vitamins": [
          {"name": "Vitamin A", "amount": "500 IU", "dailyValue": 10}
        ],
        "minerals": [
          {"name": "Iron", "amount": "2mg", "dailyValue": 11}
        ]
      }
      
      Be accurate and use USDA food database values when possible.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean response (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const nutritionData = JSON.parse(cleanedText);
    
    // Validate with Zod
    const validatedData = NutritionSchema.parse(nutritionData);
    
    return NextResponse.json(validatedData);
  } catch (error) {
    console.error("Nutrition analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze nutrition" },
      { status: 500 }
    );
  }
}
```

#### Frontend Usage (src/components/features/nutrition/SearchBar.tsx):

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar({ onResults }) {
  const [foodName, setFoodName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName, servingSize: "100g" }),
      });
      
      const data = await response.json();
      onResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter food name..."
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button onClick={handleSearch} disabled={loading}>
        {loading ? "Analyzing..." : "Search"}
      </Button>
    </div>
  );
}
```

### 2. Myth-Busting with Source Attribution

#### How It Works:

1. User submits a myth/question (e.g., "Does eating fat make you fat?")
2. Frontend sends to /api/myth-bust
3. Gemini API analyzes claim against scientific consensus
4. Returns verdict (True/False/Partially True) with explanation
5. Includes 3-5 credible sources with citations
6. Frontend displays with proper source formatting
7. Saved to Firestore for community browsing

#### Example API Route (src/app/api/myth-bust/route.ts):

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { myth } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      As a nutrition science expert, analyze this claim: "${myth}"
      
      Provide a response in this JSON format:
      {
        "verdict": "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "INCONCLUSIVE",
        "explanation": "Detailed 2-3 paragraph explanation",
        "keyPoints": ["point 1", "point 2", "point 3"],
        "sources": [
          {
            "title": "Study or article title",
            "authors": "Author names",
            "publication": "Journal or institution",
            "year": 2023,
            "url": "https://link-to-source.com",
            "summary": "Brief summary of findings"
          }
        ],
        "recommendation": "Practical advice based on evidence"
      }
      
      Base your analysis on peer-reviewed research and scientific consensus.
      Include at least 3-5 credible sources.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const mythData = JSON.parse(cleanedText);
    
    return NextResponse.json(mythData);
  } catch (error) {
    console.error("Myth-busting error:", error);
    return NextResponse.json(
      { error: "Failed to verify myth" },
      { status: 500 }
    );
  }
}
```

### 3. Image Recognition with Google Cloud Vision

#### How It Works:

1. User uploads/captures food image
2. Image is resized and converted to base64
3. Sent to /api/image-upload
4. Vision API detects food items in image
5. Each detected item is sent to Gemini for nutrition analysis
6. Combined results returned to frontend
7. Image stored in Firebase Storage (optional)

#### Example API Route (src/app/api/image-upload/route.ts):

```typescript
import vision from "@google-cloud/vision";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_PATH,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { image } = await request.json(); // base64 image
    
    // Step 1: Detect food items with Vision API
    const [result] = await visionClient.labelDetection({
      image: { content: image },
    });
    
    const labels = result.labelAnnotations || [];
    const foodLabels = labels
      .filter(label => label.score! > 0.7)
      .map(label => label.description)
      .slice(0, 5); // Top 5 detected items
    
    // Step 2: Get nutrition for each detected item
    const nutritionPromises = foodLabels.map(async (foodName) => {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Provide nutritional information for: ${foodName}`;
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      return JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
    });
    
    const nutritionData = await Promise.all(nutritionPromises);
    
    return NextResponse.json({
      detectedFoods: foodLabels,
      nutrition: nutritionData,
    });
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
```

#### Frontend Image Upload (src/components/features/nutrition/ImageUpload.tsx):

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ImageUpload({ onResults }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Convert to base64 for API
    setLoading(true);
    const base64 = await fileToBase64(file);
    
    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      
      const data = await response.json();
      onResults(data);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button as="span" disabled={loading}>
          {loading ? "Analyzing..." : "Upload Image"}
        </Button>
      </label>
      {preview && (
        <img src={preview} alt="Preview" className="mt-4 max-w-sm" />
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}
```

### 4. Data Visualization with Recharts

#### Example: Macro Breakdown Pie Chart

```typescript
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface MacroChartProps {
  protein: number;
  carbs: number;
  fats: number;
}

export function MacroChart({ protein, carbs, fats }: MacroChartProps) {
  const data = [
    { name: "Protein", value: protein, color: "#3b82f6" },
    { name: "Carbs", value: carbs, color: "#10b981" },
    { name: "Fats", value: fats, color: "#f59e0b" },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

## 📱 Progressive Web App (PWA)

### PWA Configuration

#### 1. Web App Manifest (public/manifest.json):

```json
{
  "name": "HealthyME - Nutrition & Wellness",
  "short_name": "HealthyME",
  "description": "AI-powered nutrition analysis and myth-busting platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10b981",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/screenshot-wide.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/screenshot-narrow.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["health", "lifestyle", "food"],
  "shortcuts": [
    {
      "name": "Search Food",
      "short_name": "Search",
      "description": "Quickly search for nutrition info",
      "url": "/nutrition",
      "icons": [{ "src": "/icons/search-icon.png", "sizes": "96x96" }]
    },
    {
      "name": "Bust a Myth",
      "short_name": "Myths",
      "description": "Verify nutrition myths",
      "url": "/myths",
      "icons": [{ "src": "/icons/myth-icon.png", "sizes": "96x96" }]
    }
  ]
}
```

#### 2. Service Worker (public/sw.js):

```javascript
const CACHE_NAME = "healthyme-v1";
const urlsToCache = [
  "/",
  "/nutrition",
  "/myths",
  "/dashboard",
  "/offline",
  "/styles/globals.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }).catch(() => {
      // If both cache and network fail, show offline page
      return caches.match("/offline");
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

#### 3. Register Service Worker (src/app/layout.tsx):

```typescript
"use client";

import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration);
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 🗄️ Database Schema (Firestore)

### Collections Structure

#### 1. users Collection:

```typescript
{
  uid: string;  // Firebase Auth UID
  email: string;
  displayName: string;
  createdAt: Timestamp;
  preferences: {
    dailyCalories: number;
    macroGoals: {
      protein: number;  // in grams
      carbs: number;
      fats: number;
    };
    dietType: "omnivore" | "vegetarian" | "vegan" | "pescatarian";
    allergies: string[];
  };
  stats: {
    totalSearches: number;
    favoritesCount: number;
    mythsBusted: number;
  };
}
```

#### 2. nutrition_history Subcollection:

```typescript
users/{userId}/nutrition_history/{entryId}
{
  foodName: string;
  servingSize: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  searchedAt: Timestamp;
  source: "manual_search" | "image_upload" | "barcode_scan";
}
```

#### 3. favorites Subcollection:

```typescript
users/{userId}/favorites/{foodId}
{
  foodName: string;
  nutritionData: { ... };  // Same structure as nutrition_history
  addedAt: Timestamp;
  notes: string;  // User notes
}
```

#### 4. myths Collection (Public):

```typescript
{
  mythId: string;
  question: string;
  verdict: "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "INCONCLUSIVE";
  explanation: string;
  keyPoints: string[];
  sources: Array<{
    title: string;
    authors: string;
    publication: string;
    year: number;
    url: string;
    summary: string;
  }>;
  recommendation: string;
  askedBy: string;  // userId
  askedAt: Timestamp;
  upvotes: number;
  downvotes: number;
  views: number;
}
```

#### 5. meal_logs Subcollection:

```typescript
users/{userId}/meal_logs/{logId}
{
  date: Timestamp;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foods: Array<{
    name: string;
    calories: number;
    macros: { ... };
  }>;
  totalCalories: number;
  totalMacros: { ... };
}
```

## 🔐 Security

### Authentication Flow

#### Registration:

1. User submits email/password
2. Firebase Auth creates account
3. Email verification sent
4. User document created in Firestore
5. Redirect to dashboard after email verification

#### Login:

1. Email/password submitted
2. Firebase Auth validates credentials
3. JWT token generated
4. Token stored in httpOnly cookie
5. User redirected to dashboard

#### Protected Routes:

1. Next.js middleware checks for valid token
2. Redirects to login if unauthorized
3. Allows access if token valid

### Middleware Example (src/middleware.ts):

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken");

  // Protected routes
  const protectedPaths = ["/dashboard", "/nutrition", "/myths", "/favorites"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/nutrition/:path*", "/myths/:path*", "/favorites/:path*"],
};
```

### Firestore Security Rules

Key points:

- Users can only access their own data
- Myths collection is publicly readable
- All writes require authentication
- Admin operations require admin role verification

## ⚡ Performance Optimizations

### 1. Image Optimization

- Next.js `<Image>` component for automatic optimization
- WebP format with fallback to JPEG
- Lazy loading for below-the-fold images
- Responsive images with srcSet

### 2. Code Splitting

- Automatic code splitting with Next.js App Router
- Dynamic imports for heavy components
- Route-based splitting

### 3. Caching Strategies

- API responses cached in Firestore for repeated queries
- Service Worker caches static assets
- Stale-while-revalidate for data fetching

### 4. Bundle Size Reduction

- Tree-shaking with ES modules
- Dynamic imports for large libraries
- Remove unused dependencies

#### Example Dynamic Import:

```typescript
import dynamic from "next/dynamic";

const MacroChart = dynamic(() => import("@/components/MacroChart"), {
  loading: () => <p>Loading chart...</p>,
  ssr: false,
});
```

### 5. Database Query Optimization

- Firestore indexes for common queries
- Pagination for large datasets
- Limit query results to 20 items per page

## 🚀 Deployment

### Option 1: Firebase Hosting (Recommended)

#### 1. Install Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

#### 2. Initialize Firebase in project:

```bash
firebase init hosting
# Select:
# - Use existing project
# - Build directory: out
# - Configure as single-page app: Yes
# - Set up automatic builds with GitHub: Yes (optional)
```

#### 3. Build and Deploy:

```bash
npm run build
firebase deploy
```

#### 4. Configure firebase.json:

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Option 2: Vercel (Alternative)

#### 1. Install Vercel CLI:

```bash
npm install -g vercel
```

#### 2. Deploy:

```bash
vercel
# Follow prompts
```

#### 3. Configure Environment Variables:

- Go to Vercel Dashboard → Project Settings → Environment Variables
- Add all .env.local variables

### CI/CD with GitHub Actions

#### .github/workflows/deploy.yml:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          # Add all environment variables
      
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## 🧪 Testing

### Unit Testing with Jest

#### Example Test (src/components/features/nutrition/SearchBar.test.tsx):

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("renders search input and button", () => {
    render(<SearchBar onResults={jest.fn()} />);
    expect(screen.getByPlaceholderText("Enter food name...")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("calls onResults with API data on search", async () => {
    const mockOnResults = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ name: "Apple", calories: 95 }),
      })
    );

    render(<SearchBar onResults={mockOnResults} />);
    
    const input = screen.getByPlaceholderText("Enter food name...");
    const button = screen.getByText("Search");
    
    fireEvent.change(input, { target: { value: "Apple" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnResults).toHaveBeenCalledWith({
        name: "Apple",
        calories: 95,
      });
    });
  });
});
```

#### Run Tests:

```bash
npm test
npm run test:coverage
```

## 🗺️ Roadmap

### Phase 1: MVP (Current) ✅

- ✅ Basic nutrition search
- ✅ Myth-busting interface
- ✅ User authentication
- ✅ PWA configuration
- ✅ Firestore integration

### Phase 2: Enhanced Features (Next 2 months)

- ⬜ Barcode scanning for packaged foods
- ⬜ Recipe analyzer (paste recipe URL, get nutrition)
- ⬜ Meal planning with AI suggestions
- ⬜ Social features (share meal plans, follow users)
- ⬜ Export data as PDF/CSV

### Phase 3: Advanced Features (6 months)

- ⬜ Personalized meal recommendations based on goals
- ⬜ Integration with fitness trackers (Google Fit, Apple Health)
- ⬜ Water intake tracker
- ⬜ Supplement tracker
- ⬜ Restaurant menu analyzer

### Phase 4: Community & Gamification

- ⬜ Leaderboards for consistent tracking
- ⬜ Achievements and badges
- ⬜ Community challenges
- ⬜ Nutrition coach matching
- ⬜ Premium subscription features

## 🤝 Contributing

This project is open for contributions! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Write/update tests
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines

Follow existing code style
Write tests for new features
Update documentation
Keep commits atomic and well-described
Reference issues in PRs

### Areas Needing Help

 Improve AI prompt engineering for better accuracy
 Add more food databases integration
 Enhance UI/UX with animations
 Add internationalization (i18n)
 Improve PWA offline functionality
 Write more comprehensive tests

License
MIT License - See LICENSE file for details.

🙏 Acknowledgments

Google Cloud AI for Gemini API and Vertex AI
Firebase for backend infrastructure and hosting
Next.js Team for the amazing React framework
shadcn/ui for beautiful, accessible components
Recharts for powerful data visualization
Tailwind CSS for utility-first styling
All contributors who helped improve this project


📧 Contact & Support
Developer: Salugu Harshita Bhanu
Email: shiki2hustle@gmail.com
GitHub: @Git-brintsi20
LinkedIn: Salugu Harshita Bhanu
Project Repository: https://github.com/Git-brintsi20/healthy-me
Issues & Bug Reports: GitHub Issues

📚 Additional Resources
Documentation

Next.js 14 Documentation
Firebase Documentation
Google Gemini API Documentation
Tailwind CSS Documentation
PWA Best Practices

Tutorials Used

Building with Gemini API
Next.js App Router Guide
Firebase with Next.js


<div align="center">
⭐ Star this repository if you found it helpful! ⭐
Made with ❤️ and powered by AI
Last Updated: December 2024
</div>
``
