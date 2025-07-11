// src/types/api.ts

import { NutritionFacts, NutritionError, MythVerdict } from './index';

// =================================================================
// GENERIC API TYPES
// =================================================================

/** Standard API error structure */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  path?: string;
  method?: string;
}

/** Generic API response wrapper */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp: string;
  requestId?: string;
  processingTime?: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/** API request metadata */
export interface RequestMetadata {
  userId: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: string;
  source?: 'web' | 'mobile' | 'api';
}

// =================================================================
// NUTRITION API TYPES
// =================================================================

/** Request for nutrition analysis */
export interface NutritionAnalysisRequest {
  foodItem: string;
  servingSize?: string;
  brand?: string;
  barcode?: string;
  userId: string;
  includeAlternatives?: boolean;
  detailedAnalysis?: boolean;
  language?: string;
}

/** Response from nutrition analysis */
export interface NutritionAnalysisResponse extends ApiResponse<NutritionFacts> {
  alternatives?: NutritionFacts[];
  recommendations?: Array<{
    type: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  warnings?: string[];
  confidence: number;
}

/** Batch nutrition analysis request */
export interface BatchNutritionRequest {
  foods: Array<{
    name: string;
    servingSize?: string;
    brand?: string;
  }>;
  userId: string;
  priority?: 'low' | 'normal' | 'high';
}

/** Batch nutrition analysis response */
export interface BatchNutritionResponse extends ApiResponse<NutritionFacts[]> {
  results: Array<{
    input: string;
    success: boolean;
    data?: NutritionFacts;
    error?: NutritionError;
  }>;
  successCount: number;
  failureCount: number;
}

/** Nutrition search request */
export interface NutritionSearchRequest {
  query: string;
  filters?: {
    category?: string;
    dietaryFlags?: string[];
    maxCalories?: number;
    minProtein?: number;
    allergenFree?: string[];
  };
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'calories' | 'protein' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

/** Nutrition search response */
export interface NutritionSearchResponse extends PaginatedResponse<NutritionFacts> {
  facets?: {
    categories: Array<{ name: string; count: number }>;
    dietaryFlags: Array<{ name: string; count: number }>;
    calorieRanges: Array<{ range: string; count: number }>;
  };
  suggestions?: string[];
}

// =================================================================
// MYTH-BUSTING API TYPES
// =================================================================

/** Request for myth analysis */
export interface MythAnalysisRequest {
  claim: string;
  userId: string;
  category?: string;
  includeReferences?: boolean;
  language?: string;
}

/** Response from myth analysis */
export interface MythAnalysisResponse extends ApiResponse<{
  claim: string;
  verdict: MythVerdict;
  explanation: string;
  scientificEvidence: string;
  sources: string[];
  confidence: number;
  category: string;
  relatedMyths?: string[];
}> {
  relatedFacts?: string[];
  expertOpinions?: Array<{
    expert: string;
    opinion: string;
    credibility: number;
  }>;
}

/** Myth search request */
export interface MythSearchRequest {
  query: string;
  category?: string;
  verdict?: MythVerdict;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'confidence';
}

/** Myth search response */
export interface MythSearchResponse extends PaginatedResponse<{
  id: string;
  claim: string;
  verdict: MythVerdict;
  summary: string;
  confidence: number;
  category: string;
  createdAt: string;
}> {
  categories: Array<{ name: string; count: number }>;
  verdictBreakdown: Record<MythVerdict, number>;
}

// =================================================================
// IMAGE ANALYSIS API TYPES
// =================================================================

/** Request for image analysis */
export interface ImageAnalysisRequest {
  imageUrl?: string;
  imageBase64?: string;
  userId: string;
  includeNutrition?: boolean;
  language?: string;
}

/** Response from image analysis */
export interface ImageAnalysisResponse extends ApiResponse<{
  identifiedFoods: Array<{
    name: string;
    confidence: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    nutritionFacts?: NutritionFacts;
  }>;
  overallConfidence: number;
  suggestions: string[];
  processingTime: number;
}> {
  warnings?: string[];
  imageMetadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

// =================================================================
// USER MANAGEMENT API TYPES
// =================================================================

/** Request for user profile update */
export interface UserProfileUpdateRequest {
  displayName?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
    language?: string;
    units?: 'metric' | 'imperial';
  };
  profile?: {
    dateOfBirth?: string;
    gender?: string;
    height?: number;
    weight?: number;
    activityLevel?: string;
    dietaryRestrictions?: string[];
  };
}

/** Response from user profile update */
export interface UserProfileUpdateResponse extends ApiResponse<{
  uid: string;
  displayName: string;
  email: string;
  preferences: Record<string, any>;
  profile: Record<string, any>;
  updatedAt: string;
}> {}

/** Admin user management request */
export interface AdminUserRequest {
  action: 'list' | 'get' | 'update' | 'delete' | 'suspend';
  userId?: string;
  filters?: {
    role?: string;
    status?: string;
    registrationDate?: {
      start: string;
      end: string;
    };
  };
  updates?: {
    role?: string;
    status?: string;
    permissions?: string[];
  };
  page?: number;
  limit?: number;
}

/** Admin user management response */
export interface AdminUserResponse extends ApiResponse<any> {
  users?: Array<{
    uid: string;
    email: string;
    displayName: string;
    role: string;
    status: string;
    lastLogin: string;
    createdAt: string;
  }>;
  statistics?: {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    usersByRole: Record<string, number>;
  };
}

// =================================================================
// ANALYTICS API TYPES
// =================================================================

/** Analytics request */
export interface AnalyticsRequest {
  metric: string;
  timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate?: string;
  endDate?: string;
  filters?: Record<string, any>;
  groupBy?: string;
}

/** Analytics response */
export interface AnalyticsResponse extends ApiResponse<{
  metric: string;
  timeframe: string;
  data: Array<{
    date: string;
    value: number;
    label?: string;
  }>;
  summary: {
    total: number;
    average: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
}> {
  insights?: string[];
  recommendations?: string[];
}

// =================================================================
// RECOMMENDATION API TYPES
// =================================================================

/** Request for personalized recommendations */
export interface RecommendationRequest {
  userId: string;
  type: 'nutrition' | 'myth' | 'general';
  context?: {
    recentSearches?: string[];
    preferences?: string[];
    goals?: string[];
  };
  limit?: number;
}

/** Response with personalized recommendations */
export interface RecommendationResponse extends ApiResponse<Array<{
  id: string;
  type: string;
  title: string;
  description: string;
  relevanceScore: number;
  category: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}>> {
  personalizedInsights?: string[];
  learningRecommendations?: string[];
}

// =================================================================
// EXPORT API TYPES
// =================================================================

/** Data export request */
export interface ExportRequest {
  userId: string;
  dataType: 'nutrition' | 'searches' | 'profile' | 'all';
  format: 'csv' | 'json' | 'pdf';
  dateRange?: {
    start: string;
    end: string;
  };
  includeMetadata?: boolean;
}

/** Data export response */
export interface ExportResponse extends ApiResponse<{
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: string;
  fileSize?: number;
  recordCount?: number;
}> {}

// =================================================================
// WEBHOOK API TYPES
// =================================================================

/** Webhook payload for external integrations */
export interface WebhookPayload {
  eventType: string;
  timestamp: string;
  userId: string;
  data: Record<string, any>;
  signature: string;
  version: string;
}

/** Webhook response */
export interface WebhookResponse {
  received: boolean;
  processed: boolean;
  errors?: string[];
  timestamp: string;
}

// =================================================================
// RATE LIMITING TYPES
// =================================================================

/** Rate limit information */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/** Rate limit exceeded error */
export interface RateLimitError extends ApiError {
  rateLimitInfo: RateLimitInfo;
}

// =================================================================
// UTILITY TYPES
// =================================================================

/** HTTP methods */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/** API status codes */
export type ApiStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 429 | 500 | 503;

/** Generic query parameters */
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

/** File upload request */
export interface FileUploadRequest {
  file: File;
  userId: string;
  category?: string;
  metadata?: Record<string, any>;
}

/** File upload response */
export interface FileUploadResponse extends ApiResponse<{
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  publicUrl?: string;
  metadata?: Record<string, any>;
}> {}

/** Health check response */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  services: Record<string, {
    status: 'up' | 'down' | 'degraded';
    responseTime?: number;
    lastCheck: string;
  }>;
}