// src/types/myths.ts

/**
 * @file Comprehensive myth management type definitions for the HealthyME application.
 * This file centralizes interfaces for myth content, analysis, user interactions,
 * moderation, analytics, and API structures, combining features from multiple
 * iterations for a robust system, optimized for conciseness.
 */

import { Timestamp } from 'firebase/firestore';
import { UserRole } from './auth'; // Assuming UserRole is defined in auth.ts

// =================================================================
// CORE MYTH TYPES & ENUMS
// =================================================================

/** Main myth verdict types. 'unverified' added from new version. */
export type MythVerdict = 'fact' | 'myth' | 'partially_true' | 'unknown' | 'unverified';

/** Myth confidence levels (numeric 0-1 used in analysis, this is for qualitative description). */
export type ConfidenceLevel = 'low' | 'medium' | 'high' | 'very_high';

/** Consolidated myth categories. */
export type MythCategory =
  | 'nutrition' | 'exercise' | 'supplements' | 'weight_loss' | 'mental_health' | 'sleep'
  | 'immunity' | 'chronic_disease' | 'pregnancy' | 'aging' | 'general_health' | 'food_safety'
  | 'metabolism' | 'hydration' | 'cooking' | 'health_claims';

/** Myth complexity levels. */
export type MythComplexity = 'simple' | 'moderate' | 'complex' | 'expert';

/** Consolidated myth status for content management workflow. */
export type MythStatus = 'draft' | 'pending_review' | 'published' | 'archived' | 'flagged' | 'rejected';

/** Priority levels for myth processing or review. */
export type MythPriority = 'low' | 'medium' | 'high' | 'urgent';

/** Source credibility levels. */
export type SourceCredibility = 'high' | 'medium' | 'low' | 'unverified';

// =================================================================
// MYTH CONTENT & ANALYSIS INTERFACES
// =================================================================

/** Source citation information for a myth. */
export interface MythSource {
  id: string; title: string; url: string; author?: string; publication?: string;
  publishedDate?: string; credibility: SourceCredibility; relevanceScore: number; citedAt: Timestamp;
}

/** Core myth analysis structure. */
export interface MythAnalysis {
  id: string; claim: string; verdict: MythVerdict; explanation: string; scientificEvidence: string;
  sources: string[]; confidence: number; category: MythCategory; complexity?: MythComplexity;
  tags?: string[]; keywords?: string[]; relatedMyths?: string[]; analyzedAt: Timestamp;
  analyzedBy?: string; userId?: string; verifiedBy?: string; verifiedAt?: Timestamp;
}

/** Full myth document structure for Firestore. */
export interface MythDocument {
  id: string; title: string; summary: string; myth: string; claim: string; category: MythCategory;
  status: MythStatus; priority: MythPriority; analysis: MythAnalysis; submittedBy: string;
  submittedAt: Timestamp; reviewedBy?: string; reviewedAt?: Timestamp; views: number; likes: number;
  shares: number; reports: number; popularity?: number; averageRating?: number; reviewCount?: number;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[]; slug?: string; };
  searchTerms?: string[]; tags?: string[];
  moderation?: {
    isReviewed?: boolean; reviewedBy?: string; reviewedAt?: Timestamp; reviewNotes?: string; flags?: string[];
  };
  createdAt: Timestamp; updatedAt: Timestamp;
}

/** Myth search result. */
export interface MythSearchResult {
  id: string; claim: string; title: string; summary: string; verdict: MythVerdict;
  confidence: number; category: MythCategory; tags: string[]; relevanceScore: number;
  highlight?: { claim?: string; explanation?: string; title?: string; }; createdAt: string;
}

/** Myth category with additional metadata. */
export interface MythCategoryInfo {
  id: MythCategory; name: string; description: string; icon: string; color: string;
  mythCount: number; popularityScore: number; trending: boolean; subcategories?: string[];
}

// =================================================================
// USER INTERACTION & FEEDBACK TYPES
// =================================================================

/** User interaction with myths. */
export interface MythInteraction {
  id: string; userId: string; mythId: string;
  interactionType: 'view' | 'like' | 'share' | 'report' | 'bookmark';
  timestamp: Timestamp;
  metadata?: { shareDestination?: string; reportReason?: string; viewDuration?: number; };
}

/** Myth rating/feedback. */
export interface MythFeedback {
  id: string; userId: string; mythId: string; rating: number; isHelpful: boolean;
  comment?: string; feedbackType: 'accuracy' | 'clarity' | 'completeness' | 'relevance';
  timestamp: Timestamp; isVerified: boolean;
}

/** Myth reporting. */
export interface MythReport {
  id: string; mythId: string; reporterId: string;
  reason: 'inaccurate' | 'harmful' | 'spam' | 'inappropriate' | 'copyright' | 'other';
  description: string; severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  reviewedBy?: string; reviewNotes?: string; actionTaken?: string;
  createdAt: Timestamp; updatedAt: Timestamp;
}

// =================================================================
// MYTH SUBMISSION & MODERATION TYPES
// =================================================================

/** User myth submission form data. */
export interface MythSubmissionData {
  claim: string; category: MythCategory; context?: string; source?: string;
  sources?: string[]; priority: MythPriority; tags: string[]; customAnalysis?: boolean;
}

/** User myth submission request. */
export interface MythSubmissionRequest {
  userId: string; data: MythSubmissionData; userAgent?: string; ipAddress?: string; referrer?: string;
}

/** User myth submission response. */
export interface MythSubmissionResponse {
  success: boolean; mythId?: string; estimatedReviewTime?: number; error?: string; warnings?: string[];
}

/** Myth editing form data. */
export interface MythEditData extends Partial<MythAnalysis> {
  status?: MythStatus;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[]; slug?: string; };
  moderationNotes?: string;
}

/** Bulk myth operations. */
export interface BulkMythOperation {
  operation: 'publish' | 'archive' | 'delete' | 'update_category' | 'update_status' | 'analyze' | 'validate';
  mythIds: string[];
  data?: { status?: MythStatus; category?: MythCategory; tags?: string[]; priority?: MythPriority; };
  reason?: string;
}

/** Admin moderation action types. */
export type ModerationAction = 'approve' | 'reject' | 'request_changes' | 'escalate' | 'archive' | 'flag_spam';

/** Moderation decision structure. */
export interface ModerationDecision {
  action: ModerationAction; reason: string; notes?: string; reviewedBy: string;
  reviewedAt: Timestamp; changesRequested?: string[];
}

/** Myth moderation queue item. */
export interface MythModerationItem {
  mythId: string; claim: string; category: MythCategory; status: MythStatus; priority: MythPriority;
  submittedBy: string; submittedAt: Timestamp; assignedTo?: string; deadline?: Timestamp;
  flags: string[]; estimatedReviewTime: number;
}

// =================================================================
// MYTH ANALYTICS & REPORTING TYPES
// =================================================================

/** Individual myth analytics data. */
export interface IndividualMythAnalytics {
  mythId: string; period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: {
    views: number; uniqueViews: number; shares: number; likes: number; bookmarks: number;
    reports: number; averageRating: number; averageViewDuration: number; bounceRate: number; engagementRate: number;
  };
  demographics: { ageGroups: Record<string, number>; locations: Record<string, number>; devices: Record<string, number>; };
  trends: { viewTrend: number; engagementTrend: number; ratingTrend: number; }; lastUpdated: Timestamp;
}

/** Overall myth system analytics. */
export interface OverallMythSystemAnalytics {
  totalMyths: number; publishedMyths: number; draftMyths: number; flaggedMyths: number;
  totalAnalyses: number; mythsByCategory: Record<MythCategory, number>;
  mythsByVerdict: Record<MythVerdict, number>; mythsByStatus: Record<MythStatus, number>;
  averageConfidence: number;
  topCategories: Array<{ category: MythCategory; count: number; trend?: number }>;
  recentTrends: Array<{ date: string; submissions: number; approvals: number; rejections: number; }>;
  popularMyths: Array<{ id: string; claim: string; views: number; verdict: MythVerdict; title?: string; rating?: number; }>;
  userEngagement: { activeUsers: number; avgSessionDuration: number; returnUserRate: number; };
  contentHealth: { accuracyScore: number; updateFrequency: number; sourcesPerMyth: number; };
}

/** Myth engagement metrics. */
export interface MythEngagement {
  mythId: string; views: number; likes: number; shares: number; comments: number;
  bookmarks: number; reports: number; engagementRate: number; lastEngagement: Timestamp;
}

// =================================================================
// MYTH SEARCH & FILTERING TYPES
// =================================================================

/** Myth search filters. */
export interface MythSearchFilters {
  query?: string; category?: MythCategory; verdict?: MythVerdict;
  confidence?: { min: number; max: number; }; complexity?: MythComplexity; tags?: string[];
  dateRange?: { start: string | Date; end: string | Date; }; author?: string; status?: MythStatus;
  credibilityMin?: number; popularityMin?: number;
  sortBy?: 'relevance' | 'date' | 'confidence' | 'popularity' | 'rating';
  sortOrder?: 'asc' | 'desc'; page?: number; limit?: number;
}

/** Myth search facets. */
export interface MythSearchFacets {
  categories: Array<{ category: MythCategory; count: number; selected: boolean; }>;
  verdicts: Array<{ verdict: MythVerdict; count: number; selected: boolean; }>;
  tags: Array<{ tag: string; count: number; selected: boolean; }>;
  complexities: Array<{ complexity: MythComplexity; count: number; selected: boolean; }>;
  confidenceRanges: Array<{ range: string; min: number; max: number; count: number; selected: boolean; }>;
}

/** Myth search response. */
export interface MythSearchResponse {
  myths: MythDocument[]; total: number; page: number; hasMore: boolean;
  facets?: { categories: Array<{ name: string; count: number }>; verdicts: Array<{ name: string; count: number }>; tags: Array<{ name: string; count: number }>; };
  suggestions?: string[];
}

// =================================================================
// MYTH RECOMMENDATION TYPES
// =================================================================

/** Myth recommendation. */
export interface MythRecommendation {
  id: string; mythId: string; userId: string; title: string; summary: string;
  category: MythCategory; verdict: MythVerdict; confidence: number; relevanceScore: number;
  recommendationType: 'trending' | 'similar' | 'category' | 'personalized' | 'follow_up';
  reasoning: string;
  metadata: { basedOn?: string[]; userInterests?: string[]; timeGenerated: Timestamp; };
}

/** Myth recommendation settings. */
export interface MythRecommendationSettings {
  userId: string;
  preferences: {
    categories: MythCategory[]; complexity: MythComplexity[]; excludeCategories: MythCategory[];
    maxRecommendations: number; frequency: 'daily' | 'weekly' | 'monthly';
  };
  interests: string[]; excludedMyths: string[]; lastUpdated: Timestamp;
}

// =================================================================
// MYTH COLLECTION TYPES
// =================================================================

/** Myth collection (curated lists). */
export interface MythCollection {
  id: string; name: string; description: string; mythIds: string[]; createdBy: string;
  isPublic: boolean; category?: MythCategory; tags: string[];
  metadata: { mythCount: number; followerCount: number; viewCount: number; lastUpdated: Timestamp; };
  seo: { slug: string; metaTitle?: string; metaDescription?: string; };
  createdAt: Timestamp; updatedAt: Timestamp;
}

/** User's myth collections and personal tracking. */
export interface UserMythCollections {
  userId: string; collections: MythCollection[]; favorites: string[]; bookmarks: string[];
  history: Array<{ mythId: string; viewedAt: Timestamp; viewDuration?: number; }>;
  preferences: {
    defaultSort: string; defaultView: 'grid' | 'list';
    notificationSettings: { newMyths: boolean; collections: boolean; recommendations: boolean; };
  };
}

// =================================================================
// MYTH VALIDATION TYPES
// =================================================================

/** Myth validation rules. */
export interface MythValidationRules {
  claim: { minLength: number; maxLength: number; required: boolean; patterns?: RegExp[]; };
  explanation: { minLength: number; maxLength: number; required: boolean; };
  sources: { minCount: number; maxCount: number; required: boolean; urlValidation: boolean; };
  confidence: { min: number; max: number; required: boolean; };
  category: { required: boolean; allowedValues: MythCategory[]; };
}

/** Myth validation errors. */
export interface MythValidationErrors {
  claim?: string[]; explanation?: string[]; sources?: string[]; confidence?: string[];
  category?: string[]; tags?: string[]; general?: string[];
}

// =================================================================
// MYTH EXPORT TYPES
// =================================================================

/** Myth export options. */
export interface MythExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'markdown'; includeMetadata: boolean; includeAnalytics: boolean;
  filters?: MythSearchFilters; fields?: Array<keyof MythDocument>; dateRange?: { start: string; end: string; };
}

/** Myth export result. */
export interface MythExportResult {
  exportId: string; format: string; fileUrl: string; fileName: string; fileSize: number;
  recordCount: number; createdAt: Timestamp; expiresAt: Timestamp;
  status: 'pending' | 'completed' | 'failed'; error?: string;
}

// =================================================================
// UTILITY TYPES
// =================================================================

/** Myth quick stats. */
export interface MythQuickStats {
  totalMyths: number; factsCount: number; mythsCount: number; partiallyTrueCount: number;
  unknownCount: number; averageConfidence: number; topCategory: MythCategory; lastUpdated: Timestamp;
}

/** Myth batch processing job. */
export interface MythBatchJob {
  id: string; type: 'analyze' | 'update' | 'export' | 'validate';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; totalItems: number; processedItems: number; failedItems: number;
  results?: any[]; errors?: Array<{ item: string; error: string; }>;
  createdAt: Timestamp; updatedAt: Timestamp; completedAt?: Timestamp;
}

/** Partial myth for updates. */
export type MythUpdate = Partial<Pick<MythDocument, 'category' | 'status' | 'priority' | 'tags'>>;

/** Myth summary for lists. */
export type MythSummary = Pick<MythDocument, 'id' | 'claim' | 'category' | 'status' | 'views' | 'createdAt'> & {
  verdict: MythAnalysis['verdict']; // Correctly reference nested verdict
  confidence: MythAnalysis['confidence']; // Correctly reference nested confidence
};

/** Form validation errors for myth-related forms. */
export interface MythFormErrors {
  claim?: string; category?: string; context?: string; source?: string; tags?: string;
}

// =================================================================
// CONSTANTS (for display/internal logic)
// =================================================================

/** Mapping of MythCategory to human-readable names. */
export const MYTH_CATEGORIES_DISPLAY: Record<MythCategory, string> = {
  nutrition: 'Nutrition', exercise: 'Exercise & Fitness', supplements: 'Supplements',
  weight_loss: 'Weight Loss', 'mental_health': 'Mental Health', sleep: 'Sleep',
  immunity: 'Immunity', 'chronic_disease': 'Chronic Diseases', pregnancy: 'Pregnancy',
  aging: 'Aging', 'general_health': 'General Health',
  'food_safety': 'Food Safety', metabolism: 'Metabolism', hydration: 'Hydration',
  cooking: 'Cooking & Preparation', 'health_claims': 'General Health Claims',
};

/** Confidence thresholds for UI display or logic. */
export const CONFIDENCE_THRESHOLDS = { HIGH: 0.8, MEDIUM: 0.6, LOW: 0.4 } as const;

/** UI colors associated with different myth statuses. */
export const STATUS_COLORS: Record<MythStatus, string> = {
  pending: '#f59e0b', reviewing: '#3b82f6', approved: '#10b981', rejected: '#ef4444',
  archived: '#6b7280', draft: '#a1a1aa', published: '#10b981', flagged: '#f97316',
};

/** UI colors associated with different myth verdicts. */
export const VERDICT_COLORS: Record<MythVerdict, string> = {
  fact: '#10b981', myth: '#ef4444', partially_true: '#f59e0b', unknown: '#6b7280', unverified: '#a1a1aa',
};

// =================================================================
// TYPE GUARDS
// =================================================================

/** Type guard for MythAnalysis. */
export function isMythAnalysis(data: any): data is MythAnalysis {
  return (
    typeof data === 'object' && data !== null && typeof data.claim === 'string' &&
    typeof data.verdict === 'string' && typeof data.confidence === 'number' &&
    typeof data.explanation === 'string'
  );
}

/** Type guard for MythDocument. */
export function isMythDocument(data: any): data is MythDocument {
  return (
    typeof data === 'object' && data !== null && typeof data.id === 'string' &&
    typeof data.claim === 'string' && typeof data.category === 'string' &&
    typeof data.status === 'string' && isMythAnalysis(data.analysis)
  );
}

/** Check if a user role has moderation capabilities. */
export function canModerateMyths(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'super_admin';
}

// =================================================================
// EXPORTS
// =================================================================

export type { Timestamp as FirebaseTimestamp };
