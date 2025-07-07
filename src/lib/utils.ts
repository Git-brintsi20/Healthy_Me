import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for HealthyME specific functionality

/**
 * Format nutrition value with proper units
 */
export function formatNutritionValue(value: number, unit: string): string {
  if (value === 0) return `0${unit}`
  if (value < 1) return `${value.toFixed(1)}${unit}`
  if (value < 10) return `${value.toFixed(1)}${unit}`
  return `${Math.round(value)}${unit}`
}

/**
 * Get nutrition color based on macronutrient type
 */
export function getNutritionColor(nutrient: string): string {
  const colors = {
    protein: 'hsl(var(--nutrition-protein))',
    carbs: 'hsl(var(--nutrition-carbs))',
    carbohydrates: 'hsl(var(--nutrition-carbs))',
    fat: 'hsl(var(--nutrition-fat))',
    fiber: 'hsl(var(--nutrition-fiber))',
    sugar: 'hsl(var(--nutrition-sugar))',
    sodium: 'hsl(var(--nutrition-sodium))',
    calories: 'hsl(var(--healthy-orange))',
  }
  
  return colors[nutrient.toLowerCase() as keyof typeof colors] || 'hsl(var(--muted))'
}

/**
 * Get myth-busting status color
 */
export function getMythStatusColor(status: 'true' | 'false' | 'partial'): string {
  const colors = {
    true: 'hsl(var(--myth-true))',
    false: 'hsl(var(--myth-false))',
    partial: 'hsl(var(--myth-partial))',
  }
  
  return colors[status]
}

/**
 * Calculate nutrition percentage for progress bars
 */
export function calculateNutritionPercentage(value: number, dailyValue: number): number {
  if (dailyValue === 0) return 0
  return Math.min((value / dailyValue) * 100, 100)
}

/**
 * Get nutrition grade (A, B, C, D, F) based on nutritional value
 */
export function getNutritionGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

/**
 * Format large numbers with proper units (K, M, B)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate random ID for components
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key] as T[Extract<keyof T, string>]
    }
  }
  
  return result
}