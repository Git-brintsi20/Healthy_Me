// src/lib/constants.ts

import { MythCategory, MythVerdict, MythComplexity, MythStatus } from '@/types/myths';

// =================================================================
// APPLICATION CONSTANTS
// =================================================================

export const APP_CONFIG = {
  name: 'HealthyME',
  version: '1.0.0',
  description: 'Your AI-powered nutrition companion and myth buster',
  url: 'https://healthyme.app',
  supportEmail: 'support@healthyme.app',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxBatchSize: 100,
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  rateLimitWindow: 60 * 1000, // 1 minute
  rateLimitMax: 100, // requests per window
} as const;

export const STORAGE_KEYS = {
  user: 'healthyme_user',
  preferences: 'healthyme_preferences',
  searchHistory: 'healthyme_search_history',
  recentSearches: 'healthyme_recent_searches',
  theme: 'healthyme_theme',
  onboarding: 'healthyme_onboarding_complete',
  analytics: 'healthyme_analytics_consent',
} as const;

// =================================================================
// MYTH CONSTANTS
// =================================================================

export const MYTH_CATEGORIES: Record<MythCategory, { 
  label: string; 
  description: string; 
  icon: string;
  color: string;
}> = {
  nutrition: {
    label: 'Nutrition',
    description: 'Food, diet, and nutritional claims',
    icon: 'Apple',
    color: '#22c55e',
  },
  exercise: {
    label: 'Exercise & Fitness',
    description: 'Workout, training, and fitness myths',
    icon: 'Dumbbell',
    color: '#3b82f6',
  },
  supplements: {
    label: 'Supplements',
    description: 'Vitamins, minerals, and supplement claims',
    icon: 'Pill',
    color: '#8b5cf6',
  },
  weight_loss: {
    label: 'Weight Loss',
    description: 'Diet plans, weight management myths',
    icon: 'Scale',
    color: '#f59e0b',
  },
  mental_health: {
    label: 'Mental Health',
    description: 'Psychology, stress, and mental wellness',
    icon: 'Brain',
    color: '#06b6d4',
  },
  sleep: {
    label: 'Sleep',
    description: 'Sleep patterns, insomnia, and rest myths',
    icon: 'Moon',
    color: '#6366f1',
  },
  immunity: {
    label: 'Immunity',
    description: 'Immune system and disease prevention',
    icon: 'Shield',
    color: '#10b981',
  },
  chronic_disease: {
    label: 'Chronic Disease',
    description: 'Diabetes, heart disease, and chronic conditions',
    icon: 'Heart',
    color: '#ef4444',
  },
  pregnancy: {
    label: 'Pregnancy',
    description: 'Prenatal health and pregnancy myths',
    icon: 'Baby',
    color: '#ec4899',
  },
  aging: {
    label: 'Aging',
    description: 'Anti-aging, longevity, and senior health',
    icon: 'Clock',
    color: '#64748b',
  },
  general_health: {
    label: 'General Health',
    description: 'Overall wellness and health claims',
    icon: 'Heart',
    color: '#14b8a6',
  },
  diet_trends: {
    label: 'Diet Trends',
    description: 'Popular diets and eating patterns',
    icon: 'TrendingUp',
    color: '#f97316',
  },
  food_safety: {
    label: 'Food Safety',
    description: 'Food handling, storage, and safety myths',
    icon: 'AlertTriangle',
    color: '#dc2626',
  },
  metabolism: {
    label: 'Metabolism',
    description: 'Metabolic rate and energy balance',
    icon: 'Zap',
    color: '#fbbf24',
  },
  hydration: {
    label: 'Hydration',
    description: 'Water intake and hydration myths',
    icon: 'Droplet',
    color: '#0ea5e9',
  },
} as const;

export const MYTH_VERDICTS: Record<MythVerdict, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
}> = {
  fact: {
    label: 'Fact',
    description: 'This claim is scientifically accurate',
    color: '#22c55e',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: 'CheckCircle',
  },
  myth: {
    label: 'Myth',
    description: 'This claim is false or misleading',
    color: '#ef4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: 'XCircle',
  },
  partially_true: {
    label: 'Partially True',
    description: 'This claim has some truth but needs context',
    color: '#f59e0b',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: 'AlertCircle',
  },
  unknown: {
    label: 'Unknown',
    description: 'Unable to determine accuracy',
    color: '#6b7280',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: 'HelpCircle',
  },
} as const;

export const MYTH_COMPLEXITY: Record<MythComplexity, {
  label: string;
  description: string;
  color: string;
  difficulty: number;
}> = {
  simple: {
    label: 'Simple',
    description: 'Easy to understand, basic concepts',
    color: '#22c55e',
    difficulty: 1,
  },
  moderate: {
    label: 'Moderate',
    description: 'Requires some background knowledge',
    color: '#f59e0b',
    difficulty: 2,
  },
  complex: {
    label: 'Complex',
    description: 'Advanced concepts, detailed explanation',
    color: '#ef4444',
    difficulty: 3,
  },
  expert: {
    label: 'Expert',
    description: 'Specialized knowledge required',
    color: '#8b5cf6',
    difficulty: 4,
  },
} as const;

export const MYTH_STATUS: Record<MythStatus, {
  label: string;
  description: string;
  color: string;
  canEdit: boolean;
}> = {
  draft: {
    label: 'Draft',
    description: 'Being created or edited',
    color: '#6b7280',
    canEdit: true,
  },
  pending_review: {
    label: 'Pending Review',
    description: 'Awaiting moderation approval',
    color: '#f59e0b',
    canEdit: false,
  },
  published: {
    label: 'Published',
    description: 'Live and visible to users',
    color: '#22c55e',
    canEdit: false,
  },
  archived: {
    label: 'Archived',
    description: 'Hidden from public view',
    color: '#64748b',
    canEdit: false,
  },
  flagged: {
    label: 'Flagged',
    description: 'Reported for review',
    color: '#ef4444',
    canEdit: false,
  },
} as const;

// =================================================================
// NUTRITION CONSTANTS
// =================================================================

export const NUTRITION_CATEGORIES = {
  macronutrients: {
    label: 'Macronutrients',
    items: ['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar'],
  },
  vitamins: {
    label: 'Vitamins',
    items: ['vitamin_a', 'vitamin_c', 'vitamin_d', 'vitamin_e', 'vitamin_k', 'thiamine', 'riboflavin', 'niacin', 'folate', 'vitamin_b12'],
  },
  minerals: {
    label: 'Minerals',
    items: ['calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 'sodium', 'zinc', 'selenium'],
  },
  additives: {
    label: 'Additives',
    items: ['cholesterol', 'trans_fat', 'saturated_fat', 'added_sugars'],
  },
} as const;

export const DIETARY_RESTRICTIONS = [
  'vegetarian',
  'vegan',
  'gluten_free',
  'dairy_free',
  'nut_free',
  'keto',
  'paleo',
  'low_carb',
  'low_fat',
  'low_sodium',
  'diabetic_friendly',
  'heart_healthy',
  'kosher',
  'halal',
] as const;

export const SERVING_UNITS = [
  'cup',
  'tablespoon',
  'teaspoon',
  'ounce',
  'gram',
  'kilogram',
  'pound',
  'piece',
  'slice',
  'serving',
  'container',
  'package',
] as const;

// =================================================================
// USER CONSTANTS
// =================================================================

export const USER_ROLES = {
  user: {
    label: 'User',
    permissions: ['read', 'create_feedback', 'manage_profile'],
  },
  admin: {
    label: 'Admin',
    permissions: ['read', 'write', 'moderate', 'manage_users', 'view_analytics'],
  },
  super_admin: {
    label: 'Super Admin',
    permissions: ['all'],
  },
} as const;

export const USER_STATUS = {
  active: {
    label: 'Active',
    color: '#22c55e',
    canLogin: true,
  },
  suspended: {
    label: 'Suspended',
    color: '#f59e0b',
    canLogin: false,
  },
  banned: {
    label: 'Banned',
    color: '#ef4444',
    canLogin: false,
  },
} as const;

export const ACTIVITY_LEVELS = {
  sedentary: {
    label: 'Sedentary',
    description: 'Little or no exercise',
    multiplier: 1.2,
  },
  lightly_active: {
    label: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    multiplier: 1.375,
  },
  moderately_active: {
    label: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    multiplier: 1.55,
  },
  very_active: {
    label: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    multiplier: 1.725,
  },
  extra_active: {
    label: 'Extra Active',
    description: 'Very hard exercise, physical job',
    multiplier: 1.9,
  },
} as const;

// =================================================================
// VALIDATION CONSTANTS
// =================================================================

export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  claim: {
    minLength: 10,
    maxLength: 500,
  },
  explanation: {
    minLength: 50,
    maxLength: 2000,
  },
  sources: {
    minCount: 1,
    maxCount: 10,
  },
  tags: {
    maxCount: 10,
    maxLength: 50,
  },
} as const;

export const RELIABLE_DOMAINS = [
  'pubmed.ncbi.nlm.nih.gov',
  'scholar.google.com',
  'jstor.org',
  'springer.com',
  'nature.com',
  'sciencedirect.com',
  'who.int',
  'cdc.gov',
  'nih.gov',
  'mayoclinic.org',
  'harvard.edu',
  'stanford.edu',
  'mit.edu',
  'cochrane.org',
  'bmj.com',
  'nejm.org',
  'jamanetwork.com',
  'thelancet.com',
] as const;

// =================================================================
// UI CONSTANTS
// =================================================================

export const THEME_COLORS = {
  primary: '#22c55e',
  secondary: '#64748b',
  accent: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444',
  success: '#10b981',
  info: '#06b6d4',
  light: '#f8fafc',
  dark: '#0f172a',
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

// =================================================================
// ERROR MESSAGES
// =================================================================

export const ERROR_MESSAGES = {
  network: 'Network connection error. Please check your internet connection.',
  unauthorized: 'You are not authorized to perform this action.',
  forbidden: 'Access denied. You do not have permission.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  server: 'Something went wrong on our end. Please try again later.',
  timeout: 'Request timed out. Please try again.',
  fileSize: 'File size exceeds the maximum allowed limit.',
  fileType: 'File type is not supported.',
  rateLimited: 'Too many requests. Please wait before trying again.',
} as const;

// =================================================================
// SUCCESS MESSAGES
// =================================================================

export const SUCCESS_MESSAGES = {
  mythAnalyzed: 'Myth analysis completed successfully!',
  profileUpdated: 'Profile updated successfully!',
  passwordChanged: 'Password changed successfully!',
  emailVerified: 'Email verified successfully!',
  feedbackSubmitted: 'Feedback submitted successfully!',
  reportSubmitted: 'Report submitted successfully!',
  settingsSaved: 'Settings saved successfully!',
  dataExported: 'Data exported successfully!',
  accountDeleted: 'Account deleted successfully!',
} as const;

// =================================================================
// FEATURE FLAGS
// =================================================================

export const FEATURE_FLAGS = {
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  enableImageAnalysis: process.env.NEXT_PUBLIC_ENABLE_IMAGE_ANALYSIS === 'true',
  enableBetaFeatures: process.env.NEXT_PUBLIC_ENABLE_BETA_FEATURES === 'true',
  enableDebugMode: process.env.NODE_ENV === 'development',
  enableOfflineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE === 'true',
  enableExperimentalFeatures: process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL === 'true',
} as const;

// =================================================================
// SOCIAL SHARING
// =================================================================

export const SOCIAL_SHARING = {
  twitter: {
    handle: '@HealthyMEApp',
    hashtags: ['HealthyME', 'Nutrition', 'MythBusting', 'Health'],
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  },
  linkedin: {
    company: 'healthyme',
  },
} as const;

// =================================================================
// REGEX PATTERNS
// =================================================================

export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  username: /^[a-zA-Z0-9_.-]+$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  barcode: /^\d{8,14}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// =================================================================
// EXPORT HELPER FUNCTIONS
// =================================================================

export const getConstant = <T extends Record<string, any>>(
  constants: T,
  key: keyof T,
  fallback?: any
): T[keyof T] => {
  return constants[key] || fallback;
};

export const getCategoryInfo = (category: MythCategory) => {
  return MYTH_CATEGORIES[category];
};

export const getVerdictInfo = (verdict: MythVerdict) => {
  return MYTH_VERDICTS[verdict];
};

export const getComplexityInfo = (complexity: MythComplexity) => {
  return MYTH_COMPLEXITY[complexity];
};

export const getStatusInfo = (status: MythStatus) => {
  return MYTH_STATUS[status];
};

export const isReliableDomain = (url: string): boolean => {
  try {
    const domain = new URL(url).hostname;
    return RELIABLE_DOMAINS.some(reliableDomain => 
      domain.includes(reliableDomain)
    );
  } catch {
    return false;
  }
};

export const formatErrorMessage = (error: string | Error): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.message in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.message as keyof typeof ERROR_MESSAGES];
  }
  
  return error.message || ERROR_MESSAGES.server;
};