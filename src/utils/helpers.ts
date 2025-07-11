// src/utils/helpers.ts

/**
 * Common utility functions for HealthyME app
 * Essential helpers for data manipulation, validation, and common operations
 */

// =================================================================
// TYPE DEFINITIONS
// =================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface PaginationOptions {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// =================================================================
// OBJECT UTILITIES
// =================================================================

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Get nested object value by path
 */
export function getNestedValue(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || !current.hasOwnProperty(key)) {
      return defaultValue;
    }
    current = current[key];
  }

  return current;
}

/**
 * Set nested object value by path
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Remove undefined/null values from object
 */
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key] = obj[key];
    }
  }
  
  return cleaned;
}

// =================================================================
// ARRAY UTILITIES
// =================================================================

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Remove duplicates by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by multiple keys
 */
export function sortBy<T>(array: T[], ...keys: (keyof T)[]): T[] {
  return [...array].sort((a, b) => {
    for (const key of keys) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Paginate array
 */
export function paginate<T>(array: T[], page: number, limit: number): PaginatedResult<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);
  const total = array.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Check if value is object
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if string is valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if string is valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate nutrition values
 */
export function isValidNutritionValue(value: any): boolean {
  return typeof value === 'number' && value >= 0 && isFinite(value);
}

// =================================================================
// STRING UTILITIES
// =================================================================

/**
 * Generate random string
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Extract initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Mask sensitive data
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  const maskedUsername = username.length > 2 
    ? username.slice(0, 2) + '*'.repeat(username.length - 2)
    : username;
  return `${maskedUsername}@${domain}`;
}

// =================================================================
// ERROR HANDLING
// =================================================================

/**
 * Safe function execution with error handling
 */
export function safeExecute<T>(
  fn: () => T,
  fallback: T,
  onError?: (error: Error) => void
): T {
  try {
    return fn();
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
    return fallback;
  }
}

/**
 * Safe async function execution
 */
export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  onError?: (error: Error) => void
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
    return fallback;
  }
}

/**
 * Create error with context
 */
export function createError(message: string, context?: Record<string, any>): Error {
  const error = new Error(message);
  if (context) {
    (error as any).context = context;
  }
  return error;
}

// =================================================================
// DATA TRANSFORMATION
// =================================================================

/**
 * Transform nutrition data for charts
 */
export function transformNutritionData(nutrition: any): Array<{ name: string; value: number; unit: string }> {
  const macros = [
    { name: 'Protein', value: nutrition.protein || 0, unit: 'g' },
    { name: 'Carbs', value: nutrition.carbs || 0, unit: 'g' },
    { name: 'Fat', value: nutrition.fat || 0, unit: 'g' },
    { name: 'Fiber', value: nutrition.fiber || 0, unit: 'g' },
  ];

  return macros.filter(macro => macro.value > 0);
}

/**
 * Calculate nutrition percentages
 */
export function calculateNutritionPercentages(nutrition: any): Record<string, number> {
  const protein = nutrition.protein || 0;
  const carbs = nutrition.carbs || 0;
  const fat = nutrition.fat || 0;
  
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatCals = fat * 9;
  const totalCals = proteinCals + carbsCals + fatCals;

  if (totalCals === 0) {
    return { protein: 0, carbs: 0, fat: 0 };
  }

  return {
    protein: Math.round((proteinCals / totalCals) * 100),
    carbs: Math.round((carbsCals / totalCals) * 100),
    fat: Math.round((fatCals / totalCals) * 100),
  };
}

// =================================================================
// SEARCH UTILITIES
// =================================================================

/**
 * Simple text search
 */
export function searchText(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

/**
 * Search in object properties
 */
export function searchInObject(obj: any, query: string, keys: string[]): boolean {
  for (const key of keys) {
    const value = getNestedValue(obj, key, '');
    if (typeof value === 'string' && searchText(value, query)) {
      return true;
    }
  }
  return false;
}

/**
 * Filter and search array
 */
export function filterAndSearch<T>(
  array: T[],
  query: string,
  searchKeys: (keyof T)[],
  filters?: Partial<T>
): T[] {
  let filtered = array;

  // Apply filters
  if (filters) {
    filtered = filtered.filter(item => {
      for (const key in filters) {
        if (filters[key] !== undefined && item[key] !== filters[key]) {
          return false;
        }
      }
      return true;
    });
  }

  // Apply search
  if (query.trim()) {
    filtered = filtered.filter(item =>
      searchInObject(item, query, searchKeys as string[])
    );
  }

  return filtered;
}

// =================================================================
// PERFORMANCE UTILITIES
// =================================================================

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}

/**
 * Memoize function results
 */
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// =================================================================
// EXPORT DEFAULT
// =================================================================

export default {
  // Object utilities
  deepClone,
  deepMerge,
  getNestedValue,
  setNestedValue,
  cleanObject,
  
  // Array utilities
  unique,
  uniqueBy,
  groupBy,
  sortBy,
  chunk,
  paginate,
  
  // Validation utilities
  isObject,
  isEmpty,
  isValidEmail,
  isValidUrl,
  isValidNutritionValue,
  
  // String utilities
  generateId,
  getInitials,
  maskEmail,
  
  // Error handling
  safeExecute,
  safeExecuteAsync,
  createError,
  
  // Data transformation
  transformNutritionData,
  calculateNutritionPercentages,
  
  // Search utilities
  searchText,
  searchInObject,
  filterAndSearch,
  
  // Performance utilities
  throttle,
  memoize,
};