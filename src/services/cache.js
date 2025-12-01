import { logger } from '../utils/logger';

const CACHE_PREFIX = 'tmdb_';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const SEARCH_TTL = 60 * 60 * 1000; // 1 hour for search results

/**
 * Cache item structure:
 * {
 *   data: any,
 *   timestamp: number,
 *   ttl: number
 * }
 */

/**
 * Set item in cache with TTL
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds
 */
export function setCache(key, data, ttl = DEFAULT_TTL) {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheItem));
  } catch (error) {
    logger.error('Error setting cache:', error);
  }
}

/**
 * Get item from cache if not expired
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if not found/expired
 */
export function getCache(key) {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;

    const cacheItem = JSON.parse(cached);
    const now = Date.now();
    const age = now - cacheItem.timestamp;

    // Check if expired
    if (age > cacheItem.ttl) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return cacheItem.data;
  } catch (error) {
    logger.error('Error getting cache:', error);
    return null;
  }
}

/**
 * Remove item from cache
 * @param {string} key - Cache key
 */
export function removeCache(key) {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    logger.error('Error removing cache:', error);
  }
}

/**
 * Clear all TMDb cache
 */
export function clearAllCache() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    logger.error('Error clearing cache:', error);
  }
}

/**
 * Clean expired cache entries
 */
export function cleanExpiredCache() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const cacheItem = JSON.parse(cached);
            const age = Date.now() - cacheItem.timestamp;
            if (age > cacheItem.ttl) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            // Invalid cache item, remove it
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    logger.error('Error cleaning cache:', error);
  }
}

// Helper functions for specific cache types

export function setCacheShow(showId, data) {
  setCache(`show_${showId}`, data, DEFAULT_TTL);
}

export function getCacheShow(showId) {
  return getCache(`show_${showId}`);
}

export function setCacheSeason(showId, seasonNumber, data) {
  setCache(`season_${showId}_${seasonNumber}`, data, DEFAULT_TTL);
}

export function getCacheSeason(showId, seasonNumber) {
  return getCache(`season_${showId}_${seasonNumber}`);
}

export function setCacheSearch(query, data) {
  setCache(`search_${query.toLowerCase()}`, data, SEARCH_TTL);
}

export function getCacheSearch(query) {
  return getCache(`search_${query.toLowerCase()}`);
}

// Clean expired cache on load
cleanExpiredCache();

export default {
  setCache,
  getCache,
  removeCache,
  clearAllCache,
  cleanExpiredCache,
  setCacheShow,
  getCacheShow,
  setCacheSeason,
  getCacheSeason,
  setCacheSearch,
  getCacheSearch,
};
