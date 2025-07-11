import { z } from 'zod';
import { MythVerdict } from '@/types'; // Assuming this import is correct and MythVerdict is used

// =================================================================
// COMMON VALIDATION SCHEMAS
// =================================================================

/** Email validation schema */
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')
  .max(254, 'Email must be less than 254 characters');

/** Password validation schema */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

/** URL validation schema */
const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .refine(
    (url) => {
      try {
        const parsedUrl = new URL(url);
        return ['http:', 'https:'].includes(parsedUrl.protocol);
      } catch {
        return false;
      }
    },
    'URL must use HTTP or HTTPS protocol'
  );

/** Optional URL schema */
const optionalUrlSchema = z
  .string()
  .optional()
  .refine(
    (url) => {
      if (!url) return true;
      try {
        const parsedUrl = new URL(url);
        return ['http:', 'https:'].includes(parsedUrl.protocol);
      } catch {
        return false;
      }
    },
    'URL must use HTTP or HTTPS protocol'
  );

/** Confidence score schema */
const confidenceSchema = z
  .number()
  .min(0, 'Confidence must be between 0 and 1')
  .max(1, 'Confidence must be between 0 and 1');

/** Tags validation schema */
const tagsSchema = z
  .array(z.string().trim().min(1, 'Tag cannot be empty').max(50, 'Tag must be less than 50 characters'))
  .max(10, 'Maximum 10 tags allowed')
  .optional();

// =================================================================
// MYTH VALIDATION SCHEMAS
// =================================================================

/** Myth category validation */
const mythCategorySchema = z.enum([
  'nutrition',
  'exercise',
  'supplements',
  'weight_loss',
  'mental_health',
  'sleep',
  'immunity',
  'chronic_disease',
  'pregnancy',
  'aging',
  'general_health',
  'diet_trends',
  'food_safety',
  'metabolism',
  'hydration'
] as const);

/** Myth verdict validation */
const mythVerdictSchema = z.enum(['myth', 'fact', 'partially_true'] as const);

/** Myth complexity validation */
const mythComplexitySchema = z.enum(['simple', 'moderate', 'complex', 'expert'] as const);

/** Myth status validation */
const mythStatusSchema = z.enum(['draft', 'pending_review', 'published', 'archived', 'flagged'] as const);

/** Myth claim validation */
const mythClaimSchema = z
  .string()
  .trim()
  .min(10, 'Claim must be at least 10 characters')
  .max(500, 'Claim must be less than 500 characters')
  .refine(
    (claim) => !claim.endsWith('?'),
    'Claims should be statements, not questions'
  )
  .refine(
    (claim) => {
      const inappropriateWords = ['spam', 'fake', 'scam', 'click here'];
      return !inappropriateWords.some(word => 
        claim.toLowerCase().includes(word.toLowerCase())
      );
    },
    'Claim contains inappropriate content'
  );

/** Myth explanation validation */
const mythExplanationSchema = z
  .string()
  .trim()
  .min(50, 'Explanation must be at least 50 characters')
  .max(2000, 'Explanation must be less than 2000 characters');

/** Myth scientific evidence validation */
const mythScientificEvidenceSchema = z
  .string()
  .trim()
  .min(30, 'Scientific evidence must be at least 30 characters')
  .max(1500, 'Scientific evidence must be less than 1500 characters');

/** Myth sources validation */
const mythSourcesSchema = z
  .array(urlSchema)
  .min(1, 'At least one source is required')
  .max(10, 'Maximum 10 sources allowed')
  .refine(
    (sources) => {
      const uniqueSources = new Set(sources);
      return uniqueSources.size === sources.length;
    },
    'Duplicate sources are not allowed'
  )
  .refine(
    (sources) => {
      const reliableDomains = [
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
        'mit.edu'
      ];
      return sources.some(source => {
        try {
          const url = new URL(source);
          return reliableDomains.some(domain => 
            url.hostname.includes(domain)
          );
        } catch {
          return false;
        }
      });
    },
    'At least one source must be from a reliable academic or medical institution'
  );

/** Main myth analysis validation schema */
const mythAnalysisSchema = z.object({
  claim: mythClaimSchema,
  verdict: mythVerdictSchema,
  explanation: mythExplanationSchema,
  scientificEvidence: mythScientificEvidenceSchema,
  sources: mythSourcesSchema,
  confidence: confidenceSchema,
  category: mythCategorySchema,
  complexity: mythComplexitySchema.optional(),
  tags: tagsSchema,
  relatedMyths: z.array(z.string()).max(5, 'Maximum 5 related myths allowed').optional(),
});

/** Myth creation request validation */
const mythCreationSchema = z.object({
  claim: mythClaimSchema,
  category: mythCategorySchema,
  complexity: mythComplexitySchema.optional(),
  tags: tagsSchema,
  customAnalysis: z.boolean().optional(),
  sources: z.array(urlSchema).max(5, 'Maximum 5 sources allowed').optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
});

/** Myth update validation */
const mythUpdateSchema = z.object({
  claim: mythClaimSchema.optional(),
  verdict: mythVerdictSchema.optional(),
  explanation: mythExplanationSchema.optional(),
  scientificEvidence: mythScientificEvidenceSchema.optional(),
  sources: mythSourcesSchema.optional(),
  confidence: confidenceSchema.optional(),
  category: mythCategorySchema.optional(),
  complexity: mythComplexitySchema.optional(),
  tags: tagsSchema,
  status: mythStatusSchema.optional(),
  moderationNotes: z.string().max(500, 'Moderation notes must be less than 500 characters').optional(),
});

/** Myth search validation */
const mythSearchSchema = z.object({
  query: z.string().trim().min(1, 'Search query is required').max(200, 'Search query must be less than 200 characters').optional(),
  category: mythCategorySchema.optional(),
  verdict: mythVerdictSchema.optional(),
  confidence: z.object({
    min: z.number().min(0).max(1),
    max: z.number().min(0).max(1)
  }).optional(),
  complexity: mythComplexitySchema.optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime()
  }).optional(),
  author: z.string().optional(),
  status: mythStatusSchema.optional(),
  sortBy: z.enum(['relevance', 'date', 'confidence', 'popularity', 'rating']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// =================================================================
// AUTH VALIDATION SCHEMAS
// =================================================================

/** User registration validation */
const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  displayName: z.string().trim().min(2, 'Display name must be at least 2 characters').max(50, 'Display name must be less than 50 characters'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  acceptPrivacy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

/** User login validation */
const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

/** Password reset validation */
const passwordResetSchema = z.object({
  email: emailSchema,
});

/** Password change validation */
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: "New password must be different from current password",
    path: ["newPassword"],
  }
);

/** Profile update validation */
const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(2, 'Display name must be at least 2 characters').max(50, 'Display name must be less than 50 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: optionalUrlSchema,
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    notifications: z.boolean().optional(),
    language: z.string().optional(),
    units: z.enum(['metric', 'imperial']).optional(),
  }).optional(),
  profile: z.object({
    dateOfBirth: z.string().datetime().optional(),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']).optional(),
    dietaryRestrictions: z.array(z.string()).max(10, 'Maximum 10 dietary restrictions allowed').optional(),
  }).optional(),
});

// =================================================================
// NUTRITION VALIDATION SCHEMAS
// =================================================================

/** Food item validation */
const foodItemSchema = z
  .string()
  .trim()
  .min(2, 'Food item must be at least 2 characters')
  .max(100, 'Food item must be less than 100 characters')
  .refine(
    (food) => {
      const foodPattern = /^[a-zA-Z0-9\s\-'.,()&]+$/;
      return foodPattern.test(food);
    },
    'Food item contains invalid characters'
  );

/** Serving size validation */
const servingSizeSchema = z
  .string()
  .trim()
  .min(1, 'Serving size is required')
  .max(50, 'Serving size must be less than 50 characters')
  .optional();

/** Nutrition analysis request validation */
const nutritionAnalysisSchema = z.object({
  foodItem: foodItemSchema,
  servingSize: servingSizeSchema,
  brand: z.string().max(100, 'Brand name must be less than 100 characters').optional(),
  barcode: z.string().regex(/^\d{8,14}$/, 'Barcode must be 8-14 digits').optional(),
  includeAlternatives: z.boolean().optional(),
  detailedAnalysis: z.boolean().optional(),
  language: z.string().optional(),
});

// =================================================================
// FEEDBACK & REPORTING VALIDATION SCHEMAS
// =================================================================

/** Myth feedback validation */
const mythFeedbackSchema = z.object({
  mythId: z.string().min(1, 'Myth ID is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  isHelpful: z.boolean(),
  comment: z.string().max(500, 'Comment must be less than 500 characters').optional(),
  feedbackType: z.enum(['accuracy', 'clarity', 'completeness', 'relevance']),
});

/** Myth report validation */
const mythReportSchema = z.object({
  mythId: z.string().min(1, 'Myth ID is required'),
  reason: z.enum(['inaccurate', 'harmful', 'spam', 'inappropriate', 'copyright', 'other']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

// =================================================================
// ADMIN VALIDATION SCHEMAS
// =================================================================

/** Admin user update validation */
const adminUserUpdateSchema = z.object({
  role: z.enum(['user', 'admin', 'super_admin']).optional(),
  status: z.enum(['active', 'suspended', 'banned']).optional(),
  permissions: z.array(z.string()).optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

/** Bulk operations validation */
const bulkOperationSchema = z.object({
  operation: z.enum(['publish', 'archive', 'delete', 'update_category', 'update_status']),
  itemIds: z.array(z.string()).min(1, 'At least one item must be selected').max(100, 'Maximum 100 items allowed'),
  data: z.object({
    status: mythStatusSchema.optional(),
    category: mythCategorySchema.optional(),
    tags: tagsSchema,
  }).optional(),
  reason: z.string().max(200, 'Reason must be less than 200 characters').optional(),
});

// =================================================================
// UTILITY VALIDATION FUNCTIONS
// =================================================================

/** Sanitize HTML content */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .trim();
}

/** Normalize search query */
export function normalizeSearchQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 200);
}

/** Validate image file */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image must be less than 5MB' };
  }
  
  return { isValid: true };
}

/** Validate and normalize username */
export function validateUsername(username: string): { isValid: boolean; normalized?: string; error?: string } {
  const trimmed = username.trim();
  
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (trimmed.length > 30) {
    return { isValid: false, error: 'Username must be less than 30 characters' };
  }
  
  if (!/^[a-zA-Z0-9_.-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, dots, and hyphens' };
  }
  
  const normalized = trimmed.toLowerCase();
  
  const reservedNames = ['admin', 'root', 'api', 'www', 'mail', 'support', 'help', 'info'];
  if (reservedNames.includes(normalized)) {
    return { isValid: false, error: 'This username is reserved' };
  }
  
  return { isValid: true, normalized };
}

/** Format validation errors for display */
export function formatValidationErrors(errors: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    formatted[path] = error.message;
  });
  
  return formatted;
}

/** Safe parse with better error handling */
export function safeParseWithDefaults<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaults?: Partial<T>
): { success: boolean; data?: T; errors?: Record<string, string> } {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { 
        success: true, 
        data: defaults ? { ...defaults, ...result.data } : result.data 
      };
    } else {
      return { 
        success: false, 
        errors: formatValidationErrors(result.error) 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      errors: { general: 'Validation failed due to an unexpected error' } 
    };
  }
}

/** Validate batch operation data */
export function validateBatchData<T>(
  schema: z.ZodSchema<T>,
  items: unknown[]
): { valid: T[]; invalid: Array<{ index: number; errors: Record<string, string> }> } {
  const valid: T[] = [];
  const invalid: Array<{ index: number; errors: Record<string, string> }> = [];
  
  items.forEach((item, index) => {
    const result = safeParseWithDefaults(schema, item);
    
    if (result.success && result.data) {
      valid.push(result.data);
    } else {
      invalid.push({ 
        index, 
        errors: result.errors || { general: 'Invalid data' } 
      });
    }
  });
  
  return { valid, invalid };
}

/** Custom validation helpers */
export const validationHelpers = {
  isValidAge: (age: number): boolean => age >= 13 && age <= 120,
  isValidHeight: (height: number, unit: 'cm' | 'ft'): boolean => {
    if (unit === 'cm') return height >= 100 && height <= 250;
    return height >= 3 && height <= 8;
  },
  isValidWeight: (weight: number, unit: 'kg' | 'lbs'): boolean => {
    if (unit === 'kg') return weight >= 30 && weight <= 300;
    return weight >= 66 && weight <= 660;
  },
  isStrongPassword: (password: string): boolean => {
    const criteria = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[@$!%*?&]/.test(password),
    ];
    return criteria.filter(Boolean).length >= 4;
  },
  isReliableSource: (url: string): boolean => {
    const reliableDomains = [
      'pubmed.ncbi.nlm.nih.gov',
      'scholar.google.com',
      'who.int',
      'cdc.gov',
      'nih.gov',
      'mayoclinic.org',
      'harvard.edu',
      'nature.com',
      'sciencedirect.com'
    ];
    
    try {
      const parsedUrl = new URL(url);
      return reliableDomains.some(domain => 
        parsedUrl.hostname.includes(domain)
      );
    } catch {
      return false;
    }
  }
};

// =================================================================
// EXPORT VALIDATION SCHEMAS
// =================================================================

export {
  // Common schemas
  emailSchema,
  passwordSchema,
  urlSchema,
  optionalUrlSchema,
  confidenceSchema,
  tagsSchema,
  
  // Myth schemas
  mythCategorySchema,
  mythVerdictSchema,
  mythComplexitySchema,
  mythStatusSchema,
  mythClaimSchema,
  mythExplanationSchema,
  mythScientificEvidenceSchema,
  mythSourcesSchema,
  mythAnalysisSchema,
  mythCreationSchema,
  mythUpdateSchema,
  mythSearchSchema,
  
  // Auth schemas
  userRegistrationSchema,
  userLoginSchema,
  passwordResetSchema,
  passwordChangeSchema,
  profileUpdateSchema,
  
  // Nutrition schemas
  foodItemSchema,
  servingSizeSchema,
  nutritionAnalysisSchema,
  
  // Feedback schemas
  mythFeedbackSchema,
  mythReportSchema,
  
  // Admin schemas
  adminUserUpdateSchema,
  bulkOperationSchema,
};