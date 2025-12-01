import axios from 'axios';
import { logger } from '../utils/logger';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

// Create axios instance with default config
const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Add request delay to avoid rate limiting (40 req/10 sec)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // 100ms between requests

const delayRequest = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();
};

// Search TV shows by query
export const searchShows = async (query, page = 1) => {
  try {
    await delayRequest();
    const response = await tmdbClient.get('/search/tv', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    logger.error('Error searching shows:', error);
    throw new Error(error.response?.data?.status_message || 'Failed to search shows');
  }
};

// Get TV show details
export const getShowDetails = async (tvId) => {
  try {
    await delayRequest();
    const response = await tmdbClient.get(`/tv/${tvId}`);
    return response.data;
  } catch (error) {
    logger.error('Error fetching show details:', error);
    throw new Error(error.response?.data?.status_message || 'Failed to fetch show details');
  }
};

// Get season details (includes episodes with ratings)
export const getSeasonDetails = async (tvId, seasonNumber) => {
  try {
    await delayRequest();
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching season ${seasonNumber}:`, error);
    throw new Error(error.response?.data?.status_message || `Failed to fetch season ${seasonNumber}`);
  }
};

// Get all seasons in parallel
export const getAllSeasons = async (tvId, totalSeasons) => {
  try {
    const seasonNumbers = Array.from({ length: totalSeasons }, (_, i) => i + 1);
    const seasonPromises = seasonNumbers.map(seasonNum =>
      getSeasonDetails(tvId, seasonNum)
    );
    const seasons = await Promise.all(seasonPromises);
    return seasons;
  } catch (error) {
    logger.error('Error fetching all seasons:', error);
    throw error;
  }
};

// Get episode details
export const getEpisodeDetails = async (tvId, seasonNumber, episodeNumber) => {
  try {
    await delayRequest();
    const response = await tmdbClient.get(
      `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`
    );
    return response.data;
  } catch (error) {
    logger.error(`Error fetching episode S${seasonNumber}E${episodeNumber}:`, error);
    throw new Error(error.response?.data?.status_message || 'Failed to fetch episode details');
  }
};

// Get watch providers (streaming availability) for a TV show
export const getWatchProviders = async (tvId) => {
  try {
    await delayRequest();
    const response = await tmdbClient.get(`/tv/${tvId}/watch/providers`);
    return response.data;
  } catch (error) {
    logger.error('Error fetching watch providers:', error);
    // Don't throw error, just return null if not available
    return null;
  }
};

// Get top rated TV shows
export const getTopRatedShows = async (page = 1) => {
  try {
    await delayRequest();
    const response = await tmdbClient.get('/tv/top_rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    logger.error('Error fetching top rated shows:', error);
    throw new Error(error.response?.data?.status_message || 'Failed to fetch top rated shows');
  }
};

// Get popular TV shows
export const getPopularShows = async (page = 1) => {
  try {
    await delayRequest();
    const response = await tmdbClient.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    logger.error('Error fetching popular shows:', error);
    throw new Error(error.response?.data?.status_message || 'Failed to fetch popular shows');
  }
};

// Get a random popular show
export const getRandomShow = async () => {
  try {
    // Get a random page from popular shows (pages 1-5)
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const response = await getPopularShows(randomPage);

    // Pick a random show from that page
    const shows = response.results || [];
    if (shows.length === 0) {
      throw new Error('No shows available');
    }

    const randomIndex = Math.floor(Math.random() * shows.length);
    return shows[randomIndex];
  } catch (error) {
    logger.error('Error fetching random show:', error);
    throw new Error('Failed to fetch random show');
  }
};

// Get trending TV shows
export const getTrendingShows = async (timeWindow = 'week') => {
  try {
    await delayRequest();
    const response = await tmdbClient.get(`/trending/tv/${timeWindow}`, {
      params: { page: 1 },
    });
    return response.data;
  } catch (error) {
    logger.error('Error fetching trending shows:', error);
    throw new Error(error.response?.data?.status_message || 'Failed to fetch trending shows');
  }
};

// Get image URL with size
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Export default object with all functions
export default {
  searchShows,
  getShowDetails,
  getSeasonDetails,
  getAllSeasons,
  getEpisodeDetails,
  getWatchProviders,
  getTopRatedShows,
  getPopularShows,
  getRandomShow,
  getTrendingShows,
  getImageUrl,
};
