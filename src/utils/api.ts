// src/utils/api.ts

import { auth } from '@/lib/firebase';
import { ApiResponse, ApiError, HttpMethod, QueryParams } from '@/types/api';
import { safeExecuteAsync, createError } from './helpers';

// =================================================================
// CONFIGURATION
// =================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

// =================================================================
// TYPES
// =================================================================

interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  requireAuth?: boolean;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

// =================================================================
// AUTHENTICATION HELPERS
// =================================================================

/**
 * Get authentication token from Firebase
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Create authenticated headers
 */
export async function createAuthHeaders(customHeaders?: Record<string, string>): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = await getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// =================================================================
// REQUEST HELPERS
// =================================================================

/**
 * Build URL with query parameters
 */
export function buildUrl(endpoint: string, params?: QueryParams): string {
  const url = new URL(endpoint, API_BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

/**
 * Create request configuration
 */
export async function createRequestConfig(config: RequestConfig): Promise<RequestInit> {
  const { method, headers, body, timeout = API_TIMEOUT, requireAuth = true } = config;
  
  const requestHeaders = requireAuth 
    ? await createAuthHeaders(headers)
    : { 'Content-Type': 'application/json', ...headers };

  const requestConfig: RequestInit = {
    method,
    headers: requestHeaders,
    signal: AbortSignal.timeout(timeout),
  };

  if (body && method !== 'GET') {
    requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return requestConfig;
}

// =================================================================
// ERROR HANDLING
// =================================================================

/**
 * Create API error from response
 */
export async function createApiError(response: Response, endpoint: string): Promise<ApiError> {
  let errorData: any = {};
  
  try {
    const text = await response.text();
    errorData = text ? JSON.parse(text) : {};
  } catch {
    // Ignore parse errors
  }

  return {
    code: errorData.code || `HTTP_${response.status}`,
    message: errorData.message || response.statusText || 'Unknown error',
    details: errorData.details || { status: response.status, endpoint },
    timestamp: new Date().toISOString(),
    path: endpoint,
    method: 'UNKNOWN',
  };
}

/**
 * Handle API errors with context
 */
export function handleApiError(error: any, endpoint: string, method: HttpMethod): ApiError {
  if (error.name === 'AbortError') {
    return {
      code: 'TIMEOUT',
      message: 'Request timed out',
      details: { endpoint, method },
      timestamp: new Date().toISOString(),
      path: endpoint,
      method,
    };
  }

  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed',
      details: { endpoint, method },
      timestamp: new Date().toISOString(),
      path: endpoint,
      method,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred',
    details: { endpoint, method, originalError: error },
    timestamp: new Date().toISOString(),
    path: endpoint,
    method,
  };
}

// =================================================================
// RETRY LOGIC
// =================================================================

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate retry delay with exponential backoff
 */
function calculateRetryDelay(attempt: number, config: RetryConfig): number {
  const delay = config.baseDelay * Math.pow(2, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: ApiError): boolean {
  const retryableCodes = ['TIMEOUT', 'NETWORK_ERROR', 'HTTP_429', 'HTTP_500', 'HTTP_502', 'HTTP_503'];
  return retryableCodes.includes(error.code);
}

// =================================================================
// CORE API FUNCTIONS
// =================================================================

/**
 * Make API request with retry logic
 */
export async function apiRequest<T = any>(
  endpoint: string,
  config: RequestConfig
): Promise<ApiResponse<T>> {
  const retryConfig: RetryConfig = {
    maxRetries: config.retries || MAX_RETRIES,
    baseDelay: 1000,
    maxDelay: 10000,
  };

  let lastError: ApiError | null = null;

  for (let attempt = 1; attempt <= retryConfig.maxRetries + 1; attempt++) {
    try {
      const requestConfig = await createRequestConfig(config);
      const url = buildUrl(endpoint);
      
      const response = await fetch(url, requestConfig);
      
      if (!response.ok) {
        const apiError = await createApiError(response, endpoint);
        
        if (attempt <= retryConfig.maxRetries && isRetryableError(apiError)) {
          const delay = calculateRetryDelay(attempt, retryConfig);
          await sleep(delay);
          lastError = apiError;
          continue;
        }
        
        return {
          success: false,
          data: null,
          error: apiError,
          timestamp: new Date().toISOString(),
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        error: null,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      const apiError = handleApiError(error, endpoint, config.method);
      
      if (attempt <= retryConfig.maxRetries && isRetryableError(apiError)) {
        const delay = calculateRetryDelay(attempt, retryConfig);
        await sleep(delay);
        lastError = apiError;
        continue;
      }
      
      return {
        success: false,
        data: null,
        error: apiError,
        timestamp: new Date().toISOString(),
      };
    }
  }

  return {
    success: false,
    data: null,
    error: lastError || {
      code: 'MAX_RETRIES_EXCEEDED',
      message: 'Maximum retry attempts exceeded',
      details: { endpoint, method: config.method },
      timestamp: new Date().toISOString(),
      path: endpoint,
      method: config.method,
    },
    timestamp: new Date().toISOString(),
  };
}

// =================================================================
// HTTP METHOD HELPERS
// =================================================================

/**
 * GET request
 */
export function apiGet<T = any>(
  endpoint: string,
  params?: QueryParams,
  options?: Partial<RequestConfig>
): Promise<ApiResponse<T>> {
  const url = params ? buildUrl(endpoint, params).replace(API_BASE_URL, '') : endpoint;
  return apiRequest<T>(url, {
    method: 'GET',
    ...options,
  });
}

/**
 * POST request
 */
export function apiPost<T = any>(
  endpoint: string,
  data?: any,
  options?: Partial<RequestConfig>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data,
    ...options,
  });
}

/**
 * PUT request
 */
export function apiPut<T = any>(
  endpoint: string,
  data?: any,
  options?: Partial<RequestConfig>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data,
    ...options,
  });
}

/**
 * DELETE request
 */
export function apiDelete<T = any>(
  endpoint: string,
  options?: Partial<RequestConfig>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    ...options,
  });
}

// =================================================================
// SPECIFIC API HELPERS
// =================================================================

/**
 * Analyze nutrition with error handling
 */
export async function analyzeNutrition(foodItem: string, servingSize?: string) {
  return safeExecuteAsync(
    () => apiPost('/api/analyze-nutrition', { foodItem, servingSize }),
    {
      success: false,
      data: null,
      error: {
        code: 'ANALYSIS_FAILED',
        message: 'Failed to analyze nutrition',
        details: { foodItem, servingSize },
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    }
  );
}

/**
 * Analyze image with error handling
 */
export async function analyzeImage(imageData: string) {
  return safeExecuteAsync(
    () => apiPost('/api/analyze-image', { imageData }),
    {
      success: false,
      data: null,
      error: {
        code: 'IMAGE_ANALYSIS_FAILED',
        message: 'Failed to analyze image',
        details: { imageData: 'base64_data' },
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    }
  );
}

/**
 * Get myth analysis
 */
export async function analyzeMyth(claim: string) {
  return safeExecuteAsync(
    () => apiPost('/api/myths', { claim }),
    {
      success: false,
      data: null,
      error: {
        code: 'MYTH_ANALYSIS_FAILED',
        message: 'Failed to analyze myth',
        details: { claim },
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    }
  );
}

/**
 * Get personalized recommendations
 */
export async function getRecommendations(type: string, context?: any) {
  return safeExecuteAsync(
    () => apiPost('/api/recommendations', { type, context }),
    {
      success: false,
      data: null,
      error: {
        code: 'RECOMMENDATIONS_FAILED',
        message: 'Failed to get recommendations',
        details: { type, context },
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    }
  );
}

// =================================================================
// UTILITY EXPORTS
// =================================================================

export const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  request: apiRequest,
  
  // Specific helpers
  analyzeNutrition,
  analyzeImage,
  analyzeMyth,
  getRecommendations,
  
  // Utilities
  buildUrl,
  getAuthToken,
  createAuthHeaders,
};

export default api;