// src/utils/date.ts

/**
 * Date utility functions for HealthyME app
 * Handles date formatting, time calculations, and timezone operations
 */

// =================================================================
// DATE FORMAT CONSTANTS
// =================================================================

export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  US: 'MM/DD/YYYY',
  EU: 'DD/MM/YYYY',
  LONG: 'MMMM DD, YYYY',
  SHORT: 'MMM DD',
  TIME: 'HH:mm',
  TIME_12: 'hh:mm A',
  DATETIME: 'YYYY-MM-DD HH:mm',
  DATETIME_12: 'MM/DD/YYYY hh:mm A',
  RELATIVE: 'relative',
} as const;

export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

// =================================================================
// TYPE DEFINITIONS
// =================================================================

export type DateInput = string | number | Date;
export type DateFormat = keyof typeof DATE_FORMATS;
export type TimeUnit = keyof typeof TIME_UNITS;

export interface DateRange {
  start: Date;
  end: Date;
}

export interface RelativeTimeOptions {
  addSuffix?: boolean;
  includeSeconds?: boolean;
  locale?: string;
}

export interface FormatOptions {
  format?: string;
  locale?: string;
  timezone?: string;
}

// =================================================================
// CORE DATE FUNCTIONS
// =================================================================

/**
 * Safely parse a date input
 */
export function parseDate(input: DateInput): Date {
  if (input instanceof Date) {
    return input;
  }
  
  if (typeof input === 'string') {
    // Handle ISO strings and common formats
    const date = new Date(input);
    if (isValidDate(date)) {
      return date;
    }
    
    // Try parsing MM/DD/YYYY format
    const mmddyyyy = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mmddyyyy) {
      const [, month, day, year] = mmddyyyy;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    // Try parsing DD/MM/YYYY format
    const ddmmyyyy = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, day, month, year] = ddmmyyyy;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
  }
  
  if (typeof input === 'number') {
    return new Date(input);
  }
  
  throw new Error(`Invalid date input: ${input}`);
}

/**
 * Check if a date is valid
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Get current date/time
 */
export function now(): Date {
  return new Date();
}

/**
 * Get today's date at midnight
 */
export function today(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get yesterday's date
 */
export function yesterday(): Date {
  const date = today();
  date.setDate(date.getDate() - 1);
  return date;
}

/**
 * Get tomorrow's date
 */
export function tomorrow(): Date {
  const date = today();
  date.setDate(date.getDate() + 1);
  return date;
}

// =================================================================
// DATE FORMATTING
// =================================================================

/**
 * Format a date using built-in Intl.DateTimeFormat
 */
export function formatDate(
  date: DateInput,
  format: DateFormat = 'ISO',
  options: FormatOptions = {}
): string {
  const parsedDate = parseDate(date);
  const { locale = 'en-US', timezone } = options;
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
  };
  
  switch (format) {
    case 'ISO':
      return parsedDate.toISOString().split('T')[0];
      
    case 'US':
      return parsedDate.toLocaleDateString('en-US', {
        ...formatOptions,
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      
    case 'EU':
      return parsedDate.toLocaleDateString('en-GB', {
        ...formatOptions,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      
    case 'LONG':
      return parsedDate.toLocaleDateString(locale, {
        ...formatOptions,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
    case 'SHORT':
      return parsedDate.toLocaleDateString(locale, {
        ...formatOptions,
        month: 'short',
        day: 'numeric',
      });
      
    case 'TIME':
      return parsedDate.toLocaleTimeString(locale, {
        ...formatOptions,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      
    case 'TIME_12':
      return parsedDate.toLocaleTimeString(locale, {
        ...formatOptions,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      
    case 'DATETIME':
      return `${formatDate(parsedDate, 'ISO')} ${formatDate(parsedDate, 'TIME')}`;
      
    case 'DATETIME_12':
      return `${formatDate(parsedDate, 'US')} ${formatDate(parsedDate, 'TIME_12')}`;
      
    case 'RELATIVE':
      return formatRelativeTime(parsedDate);
      
    default:
      return parsedDate.toLocaleDateString(locale, formatOptions);
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(
  date: DateInput,
  options: RelativeTimeOptions = {}
): string {
  const parsedDate = parseDate(date);
  const currentDate = now();
  const diff = parsedDate.getTime() - currentDate.getTime();
  const absDiff = Math.abs(diff);
  
  const { addSuffix = true, includeSeconds = false } = options;
  
  // Handle future vs past
  const isPast = diff < 0;
  const suffix = addSuffix ? (isPast ? ' ago' : ' from now') : '';
  
  // Calculate appropriate unit
  if (absDiff < TIME_UNITS.MINUTE) {
    if (includeSeconds) {
      const seconds = Math.floor(absDiff / TIME_UNITS.SECOND);
      return `${seconds} second${seconds !== 1 ? 's' : ''}${suffix}`;
    }
    return `just now`;
  }
  
  if (absDiff < TIME_UNITS.HOUR) {
    const minutes = Math.floor(absDiff / TIME_UNITS.MINUTE);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}${suffix}`;
  }
  
  if (absDiff < TIME_UNITS.DAY) {
    const hours = Math.floor(absDiff / TIME_UNITS.HOUR);
    return `${hours} hour${hours !== 1 ? 's' : ''}${suffix}`;
  }
  
  if (absDiff < TIME_UNITS.WEEK) {
    const days = Math.floor(absDiff / TIME_UNITS.DAY);
    return `${days} day${days !== 1 ? 's' : ''}${suffix}`;
  }
  
  if (absDiff < TIME_UNITS.MONTH) {
    const weeks = Math.floor(absDiff / TIME_UNITS.WEEK);
    return `${weeks} week${weeks !== 1 ? 's' : ''}${suffix}`;
  }
  
  if (absDiff < TIME_UNITS.YEAR) {
    const months = Math.floor(absDiff / TIME_UNITS.MONTH);
    return `${months} month${months !== 1 ? 's' : ''}${suffix}`;
  }
  
  const years = Math.floor(absDiff / TIME_UNITS.YEAR);
  return `${years} year${years !== 1 ? 's' : ''}${suffix}`;
}

// =================================================================
// DATE CALCULATIONS
// =================================================================

/**
 * Add time to a date
 */
export function addTime(
  date: DateInput,
  amount: number,
  unit: TimeUnit
): Date {
  const parsedDate = parseDate(date);
  const newDate = new Date(parsedDate);
  
  switch (unit) {
    case 'SECOND':
      newDate.setSeconds(newDate.getSeconds() + amount);
      break;
    case 'MINUTE':
      newDate.setMinutes(newDate.getMinutes() + amount);
      break;
    case 'HOUR':
      newDate.setHours(newDate.getHours() + amount);
      break;
    case 'DAY':
      newDate.setDate(newDate.getDate() + amount);
      break;
    case 'WEEK':
      newDate.setDate(newDate.getDate() + (amount * 7));
      break;
    case 'MONTH':
      newDate.setMonth(newDate.getMonth() + amount);
      break;
    case 'YEAR':
      newDate.setFullYear(newDate.getFullYear() + amount);
      break;
  }
  
  return newDate;
}

/**
 * Subtract time from a date
 */
export function subtractTime(
  date: DateInput,
  amount: number,
  unit: TimeUnit
): Date {
  return addTime(date, -amount, unit);
}

/**
 * Calculate difference between two dates
 */
export function getDateDifference(
  date1: DateInput,
  date2: DateInput,
  unit: TimeUnit = 'DAY'
): number {
  const parsedDate1 = parseDate(date1);
  const parsedDate2 = parseDate(date2);
  
  const diff = parsedDate1.getTime() - parsedDate2.getTime();
  return Math.floor(diff / TIME_UNITS[unit]);
}

/**
 * Check if a date is in the past
 */
export function isPast(date: DateInput): boolean {
  return parseDate(date).getTime() < now().getTime();
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: DateInput): boolean {
  return parseDate(date).getTime() > now().getTime();
}

/**
 * Check if a date is today
 */
export function isToday(date: DateInput): boolean {
  const parsedDate = parseDate(date);
  const todayDate = today();
  return parsedDate.toDateString() === todayDate.toDateString();
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: DateInput): boolean {
  const parsedDate = parseDate(date);
  const yesterdayDate = yesterday();
  return parsedDate.toDateString() === yesterdayDate.toDateString();
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(date: DateInput): boolean {
  const parsedDate = parseDate(date);
  const tomorrowDate = tomorrow();
  return parsedDate.toDateString() === tomorrowDate.toDateString();
}

// =================================================================
// DATE RANGE FUNCTIONS
// =================================================================

/**
 * Create a date range
 */
export function createDateRange(start: DateInput, end: DateInput): DateRange {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  
  if (startDate > endDate) {
    throw new Error('Start date must be before end date');
  }
  
  return { start: startDate, end: endDate };
}

/**
 * Check if a date falls within a range
 */
export function isDateInRange(date: DateInput, range: DateRange): boolean {
  const parsedDate = parseDate(date);
  return parsedDate >= range.start && parsedDate <= range.end;
}

/**
 * Get the start of a time period
 */
export function startOf(date: DateInput, unit: 'day' | 'week' | 'month' | 'year'): Date {
  const parsedDate = parseDate(date);
  const newDate = new Date(parsedDate);
  
  switch (unit) {
    case 'day':
      newDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      newDate.setDate(newDate.getDate() - newDate.getDay());
      newDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      newDate.setDate(1);
      newDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      newDate.setMonth(0, 1);
      newDate.setHours(0, 0, 0, 0);
      break;
  }
  
  return newDate;
}

/**
 * Get the end of a time period
 */
export function endOf(date: DateInput, unit: 'day' | 'week' | 'month' | 'year'): Date {
  const parsedDate = parseDate(date);
  const newDate = new Date(parsedDate);
  
  switch (unit) {
    case 'day':
      newDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      newDate.setDate(newDate.getDate() + (6 - newDate.getDay()));
      newDate.setHours(23, 59, 59, 999);
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + 1, 0);
      newDate.setHours(23, 59, 59, 999);
      break;
    case 'year':
      newDate.setMonth(11, 31);
      newDate.setHours(23, 59, 59, 999);
      break;
  }
  
  return newDate;
}

// =================================================================
// VALIDATION FUNCTIONS
// =================================================================

/**
 * Check if a date string matches a format
 */
export function isValidDateFormat(dateString: string, format: DateFormat): boolean {
  try {
    const date = parseDate(dateString);
    if (!isValidDate(date)) {
      return false;
    }
    
    // Check if formatting the parsed date matches the original
    return formatDate(date, format) === dateString;
  } catch {
    return false;
  }
}

/**
 * Check if a date is within a reasonable range
 */
export function isReasonableDate(date: DateInput): boolean {
  try {
    const parsedDate = parseDate(date);
    const minDate = new Date(1900, 0, 1);
    const maxDate = new Date(2100, 11, 31);
    
    return parsedDate >= minDate && parsedDate <= maxDate;
  } catch {
    return false;
  }
}

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

/**
 * Get user's timezone
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Convert date to user's timezone
 */
export function toUserTimezone(date: DateInput, timezone?: string): Date {
  const parsedDate = parseDate(date);
  const userTz = timezone || getUserTimezone();
  
  const utcTime = parsedDate.getTime() + (parsedDate.getTimezoneOffset() * 60000);
  const targetTime = new Date(utcTime);
  
  return targetTime;
}

/**
 * Get age from birthdate
 */
export function getAge(birthDate: DateInput): number {
  const birth = parseDate(birthDate);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format duration in milliseconds to human readable format
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Get common date presets
 */
export function getDatePresets(): Record<string, DateRange> {
  const todayDate = today();
  
  return {
    today: {
      start: todayDate,
      end: todayDate,
    },
    yesterday: {
      start: yesterday(),
      end: yesterday(),
    },
    thisWeek: {
      start: startOf(todayDate, 'week'),
      end: endOf(todayDate, 'week'),
    },
    lastWeek: {
      start: startOf(subtractTime(todayDate, 1, 'WEEK'), 'week'),
      end: endOf(subtractTime(todayDate, 1, 'WEEK'), 'week'),
    },
    thisMonth: {
      start: startOf(todayDate, 'month'),
      end: endOf(todayDate, 'month'),
    },
    lastMonth: {
      start: startOf(subtractTime(todayDate, 1, 'MONTH'), 'month'),
      end: endOf(subtractTime(todayDate, 1, 'MONTH'), 'month'),
    },
    thisYear: {
      start: startOf(todayDate, 'year'),
      end: endOf(todayDate, 'year'),
    },
    lastYear: {
      start: startOf(subtractTime(todayDate, 1, 'YEAR'), 'year'),
      end: endOf(subtractTime(todayDate, 1, 'YEAR'), 'year'),
    },
  };
}

export default {
  parseDate,
  isValidDate,
  now,
  today,
  yesterday,
  tomorrow,
  formatDate,
  formatRelativeTime,
  addTime,
  subtractTime,
  getDateDifference,
  isPast,
  isFuture,
  isToday,
  isYesterday,
  isTomorrow,
  createDateRange,
  isDateInRange,
  startOf,
  endOf,
  isValidDateFormat,
  isReasonableDate,
  getUserTimezone,
  toUserTimezone,
  getAge,
  formatDuration,
  getDatePresets,
};