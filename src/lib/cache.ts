// lib/cache.ts

import { doc, getDoc, setDoc, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from './firebase';

// Cache configuration
const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  NUTRITION_TTL: 30 * 60 * 1000, // 30 minutes
  MYTHS_TTL: 60 * 60 * 1000, // 1 hour
  USER_TTL: 10 * 60 * 1000, // 10 minutes
  SEARCH_TTL: 2 * 60 * 1000, // 2 minutes
  MAX_CACHE_SIZE: 100,
  CLEANUP_INTERVAL: 10 * 60 * 1000, // 10 minutes
} as const;

// Cache entry interface
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
  hits: number;
  lastAccessed: number;
}

// Cache statistics interface
interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  oldestEntry: number;
  newestEntry: number;
}

// Cache types
export type CacheKey = string;
export type CacheValue = any;

class CacheManager {
  private cache = new Map<CacheKey, CacheEntry>();
  private stats = {
    hits: 0,
    misses: 0,
  };
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTimer();
  }

  /**
   * Get data from cache
   */
  get<T>(key: CacheKey): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry has expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access statistics
    entry.hits++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;

    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  set<T>(key: CacheKey, data: T, ttl: number = CACHE_CONFIG.DEFAULT_TTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      key,
      hits: 0,
      lastAccessed: Date.now(),
    };

    this.cache.set(key, entry);
    this.enforceMaxSize();
  }

  /**
   * Delete specific cache entry
   */
  delete(key: CacheKey): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Check if cache entry exists and is valid
   */
  has(key: CacheKey): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : now,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : now,
    };
  }

  /**
   * Get cache entries for debugging
   */
  getEntries(): Array<{ key: string; age: number; hits: number; size: number }> {
    const now = Date.now();
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      hits: entry.hits,
      size: JSON.stringify(entry.data).length,
    }));
  }

  /**
   * Invalidate entries by pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: CacheKey[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Cache with automatic fetching
   */
  async getOrFetch<T>(
    key: CacheKey,
    fetcher: () => Promise<T>,
    ttl: number = CACHE_CONFIG.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private enforceMaxSize(): void {
    if (this.cache.size <= CACHE_CONFIG.MAX_CACHE_SIZE) {
      return;
    }

    // Remove least recently used entries
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

    const entriesToRemove = entries.slice(0, this.cache.size - CACHE_CONFIG.MAX_CACHE_SIZE);
    entriesToRemove.forEach(([key]) => this.cache.delete(key));
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: CacheKey[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, CACHE_CONFIG.CLEANUP_INTERVAL);
  }
}

// Global cache instance
export const cache = new CacheManager();

// Firestore caching helpers
export class FirestoreCache {
  /**
   * Get document with caching
   */
  static async getDocument<T>(
    collectionName: string,
    docId: string,
    ttl: number = CACHE_CONFIG.DEFAULT_TTL
  ): Promise<T | null> {
    const cacheKey = `doc:${collectionName}:${docId}`;
    
    return cache.getOrFetch(
      cacheKey,
      async () => {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as T;
        }
        return null;
      },
      ttl
    );
  }

  /**
   * Get collection with caching
   */
  static async getCollection<T>(
    collectionName: string,
    constraints: any[] = [],
    ttl: number = CACHE_CONFIG.DEFAULT_TTL
  ): Promise<T[]> {
    const cacheKey = `collection:${collectionName}:${JSON.stringify(constraints)}`;
    
    return cache.getOrFetch(
      cacheKey,
      async () => {
        const collectionRef = collection(db, collectionName);
        const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
      },
      ttl
    );
  }

  /**
   * Invalidate document cache
   */
  static invalidateDocument(collectionName: string, docId: string): void {
    const cacheKey = `doc:${collectionName}:${docId}`;
    cache.delete(cacheKey);
  }

  /**
   * Invalidate collection cache
   */
  static invalidateCollection(collectionName: string): void {
    cache.invalidatePattern(`collection:${collectionName}:`);
  }
}

// API response caching
export class APICache {
  /**
   * Cache API responses
   */
  static async cacheAPIResponse<T>(
    endpoint: string,
    params: Record<string, any> = {},
    fetcher: () => Promise<T>,
    ttl: number = CACHE_CONFIG.DEFAULT_TTL
  ): Promise<T> {
    const cacheKey = `api:${endpoint}:${JSON.stringify(params)}`;
    return cache.getOrFetch(cacheKey, fetcher, ttl);
  }

  /**
   * Invalidate API cache by endpoint
   */
  static invalidateEndpoint(endpoint: string): void {
    cache.invalidatePattern(`api:${endpoint}:`);
  }
}

// Search result caching
export class SearchCache {
  /**
   * Cache search results
   */
  static async cacheSearchResults<T>(
    searchType: string,
    query: string,
    filters: Record<string, any>,
    fetcher: () => Promise<T>,
    ttl: number = CACHE_CONFIG.SEARCH_TTL
  ): Promise<T> {
    const cacheKey = `search:${searchType}:${query}:${JSON.stringify(filters)}`;
    return cache.getOrFetch(cacheKey, fetcher, ttl);
  }

  /**
   * Invalidate search cache
   */
  static invalidateSearchType(searchType: string): void {
    cache.invalidatePattern(`search:${searchType}:`);
  }
}

// Cache key generators
export const CacheKeys = {
  user: (uid: string) => `user:${uid}`,
  nutrition: (foodName: string) => `nutrition:${foodName.toLowerCase()}`,
  myth: (mythId: string) => `myth:${mythId}`,
  search: (type: string, query: string) => `search:${type}:${query}`,
  userFavorites: (uid: string) => `favorites:${uid}`,
  userHistory: (uid: string) => `history:${uid}`,
  recommendations: (uid: string) => `recommendations:${uid}`,
};

// Cache preloader for critical data
export class CachePreloader {
  /**
   * Preload critical data
   */
  static async preloadCriticalData(): Promise<void> {
    try {
      // Preload popular myths
      await FirestoreCache.getCollection(
        'myths',
        [orderBy('popularity', 'desc'), limit(10)],
        CACHE_CONFIG.MYTHS_TTL
      );

      // Preload common nutrition facts
      const commonFoods = ['apple', 'banana', 'chicken', 'rice', 'broccoli'];
      await Promise.all(
        commonFoods.map(food =>
          FirestoreCache.getCollection(
            'nutrition_facts',
            [where('foodName', '==', food)],
            CACHE_CONFIG.NUTRITION_TTL
          )
        )
      );
    } catch (error) {
      console.error('Failed to preload critical data:', error);
    }
  }
}

// Export default cache instance and utilities
export default cache;
export { CACHE_CONFIG, CacheManager };