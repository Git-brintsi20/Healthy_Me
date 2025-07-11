// src/utils/format.ts

/**
 * Data formatting utilities for HealthyME app
 * Handles nutrition values, numbers, currency, and text formatting
 */

// =================================================================
// TYPE DEFINITIONS
// =================================================================

export interface FormatOptions {
  locale?: string;
  currency?: string;
  decimals?: number;
  showUnit?: boolean;
  shortFormat?: boolean;
}

export interface NutritionFormatOptions extends FormatOptions {
  showZero?: boolean;
  unitType?: 'metric' | 'imperial';
}

// =================================================================
// NUTRITION FORMATTING
// =================================================================

/**
 * Format calorie values
 */
export function formatCalories(
  value: number,
  options: NutritionFormatOptions = {}
): string {
  const { showZero = false, showUnit = true, decimals = 0 } = options;
  
  if (value === 0 && !showZero) return '0';
  
  const formatted = formatNumber(value, { decimals });
  return showUnit ? `${formatted} cal` : formatted;
}

/**
 * Format macronutrient values (protein, carbs, fat, fiber)
 */
export function formatMacros(
  value: number,
  options: NutritionFormatOptions = {}
): string {
  const { showZero = false, showUnit = true, decimals = 1 } = options;
  
  if (value === 0 && !showZero) return '0';
  
  const formatted = formatNumber(value, { decimals });
  return showUnit ? `${formatted}g` : formatted;
}

/**
 * Format percentage values
 */
export function formatPercentage(
  value: number,
  options: FormatOptions = {}
): string {
  const { decimals = 0 } = options;
  
  if (value === 0) return '0%';
  
  const formatted = formatNumber(value, { decimals });
  return `${formatted}%`;
}

/**
 * Format weight values
 */
export function formatWeight(
  value: number,
  options: NutritionFormatOptions = {}
): string {
  const { unitType = 'metric', showUnit = true, decimals = 1 } = options;
  
  if (value === 0) return '0';
  
  const formatted = formatNumber(value, { decimals });
  
  if (!showUnit) return formatted;
  
  return unitType === 'metric' ? `${formatted}kg` : `${formatted}lbs`;
}

/**
 * Format serving sizes
 */
export function formatServing(
  value: number,
  unit: string,
  options: NutritionFormatOptions = {}
): string {
  const { decimals = 1 } = options;
  
  if (value === 0) return '0';
  
  const formatted = formatNumber(value, { decimals });
  return `${formatted} ${unit}`;
}

/**
 * Format nutrition label display
 */
export function formatNutritionLabel(
  name: string,
  value: number,
  unit: string,
  dailyValue?: number
): string {
  const formattedValue = formatNumber(value, { decimals: 1 });
  let result = `${name}: ${formattedValue}${unit}`;
  
  if (dailyValue && dailyValue > 0) {
    const percentage = Math.round((value / dailyValue) * 100);
    result += ` (${percentage}% DV)`;
  }
  
  return result;
}

// =================================================================
// NUMBER FORMATTING
// =================================================================

/**
 * Format numbers with locale support
 */
export function formatNumber(
  value: number,
  options: FormatOptions = {}
): string {
  const { locale = 'en-US', decimals = 0, shortFormat = false } = options;
  
  if (shortFormat && Math.abs(value) >= 1000) {
    return formatShortNumber(value, locale);
  }
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatShortNumber(
  value: number,
  locale: string = 'en-US'
): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(1)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(1)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(1)}K`;
  }
  
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format currency values
 */
export function formatCurrency(
  value: number,
  options: FormatOptions = {}
): string {
  const { locale = 'en-US', currency = 'USD', decimals = 2 } = options;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// =================================================================
// TEXT FORMATTING
// =================================================================

/**
 * Truncate text with ellipsis
 */
export function truncateText(
  text: string,
  maxLength: number,
  options: { suffix?: string } = {}
): string {
  const { suffix = '...' } = options;
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert to title case
 */
export function toTitleCase(text: string): string {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Format text for display (remove underscores, capitalize)
 */
export function formatDisplayText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Create slug from text
 */
export function createSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// =================================================================
// SPECIALIZED FORMATTING
// =================================================================

/**
 * Format myth verdict for display
 */
export function formatMythVerdict(verdict: string): string {
  const verdictMap: Record<string, string> = {
    myth: 'Myth',
    fact: 'Fact',
    partially_true: 'Partially True',
    unknown: 'Unknown',
  };
  
  return verdictMap[verdict] || formatDisplayText(verdict);
}

/**
 * Format myth category for display
 */
export function formatMythCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    nutrition: 'Nutrition',
    weight_loss: 'Weight Loss',
    diet_trends: 'Diet Trends',
    supplements: 'Supplements',
    food_safety: 'Food Safety',
    exercise: 'Exercise',
    general_health: 'General Health',
  };
  
  return categoryMap[category] || formatDisplayText(category);
}

/**
 * Format user role for display
 */
export function formatUserRole(role: string): string {
  const roleMap: Record<string, string> = {
    user: 'User',
    admin: 'Administrator',
    super_admin: 'Super Administrator',
  };
  
  return roleMap[role] || formatDisplayText(role);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(
  phoneNumber: string,
  format: 'US' | 'INTERNATIONAL' = 'US'
): string {
  // Remove all non-numeric characters
  const numbers = phoneNumber.replace(/\D/g, '');
  
  if (format === 'US' && numbers.length === 10) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  
  if (format === 'INTERNATIONAL' && numbers.length >= 10) {
    const countryCode = numbers.slice(0, -10);
    const areaCode = numbers.slice(-10, -7);
    const firstPart = numbers.slice(-7, -4);
    const secondPart = numbers.slice(-4);
    
    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
  }
  
  return phoneNumber;
}

// =================================================================
// VALIDATION HELPERS
// =================================================================

/**
 * Check if value is a valid number
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Safe number formatting (handles invalid inputs)
 */
export function safeFormatNumber(
  value: any,
  options: FormatOptions = {}
): string {
  if (!isValidNumber(value)) {
    return '0';
  }
  
  return formatNumber(value, options);
}

/**
 * Safe nutrition formatting
 */
export function safeFormatNutrition(
  value: any,
  type: 'calories' | 'macros' | 'percentage' | 'weight',
  options: NutritionFormatOptions = {}
): string {
  if (!isValidNumber(value)) {
    return '0';
  }
  
  switch (type) {
    case 'calories':
      return formatCalories(value, options);
    case 'macros':
      return formatMacros(value, options);
    case 'percentage':
      return formatPercentage(value, options);
    case 'weight':
      return formatWeight(value, options);
    default:
      return formatNumber(value, options);
  }
}

// =================================================================
// CHART DATA FORMATTING
// =================================================================

/**
 * Format data for chart displays
 */
export function formatChartData(
  data: Array<{ name: string; value: number }>,
  options: FormatOptions = {}
): Array<{ name: string; value: number; formattedValue: string }> {
  return data.map(item => ({
    ...item,
    formattedValue: formatNumber(item.value, options)
  }));
}

/**
 * Format nutrition data for charts
 */
export function formatNutritionChartData(
  data: Array<{ name: string; value: number; unit: string }>
): Array<{ name: string; value: number; label: string }> {
  return data.map(item => ({
    name: item.name,
    value: item.value,
    label: `${formatNumber(item.value, { decimals: 1 })}${item.unit}`
  }));
}

// =================================================================
// EXPORT DEFAULT
// =================================================================

export default {
  // Nutrition formatting
  formatCalories,
  formatMacros,
  formatPercentage,
  formatWeight,
  formatServing,
  formatNutritionLabel,
  
  // Number formatting
  formatNumber,
  formatShortNumber,
  formatCurrency,
  
  // Text formatting
  truncateText,
  capitalize,
  toTitleCase,
  formatDisplayText,
  createSlug,
  
  // Specialized formatting
  formatMythVerdict,
  formatMythCategory,
  formatUserRole,
  formatFileSize,
  formatPhoneNumber,
  
  // Validation helpers
  isValidNumber,
  safeFormatNumber,
  safeFormatNutrition,
  
  // Chart data formatting
  formatChartData,
  formatNutritionChartData,
};