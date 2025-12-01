// API Configuration
export const API_CONFIG = {
  SEARCH_DEBOUNCE_MS: 500,
  MIN_SEARCH_LENGTH: 2,
  DEFAULT_PAGE_SIZE: 20,
};

// UI Constants
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 640,
  TABLET_BREAKPOINT: 1024,
  CELL_SIZE_MOBILE: 24,
  CELL_SIZE_TABLET: 32,
  CELL_SIZE_DESKTOP: 40,
  TOOLTIP_OFFSET: 10,
  MODAL_Z_INDEX: 50,
};

// Image Sizes
export const IMAGE_SIZES = {
  POSTER_SMALL: 'w185',
  POSTER_MEDIUM: 'w342',
  POSTER_LARGE: 'w500',
  POSTER_XLARGE: 'w780',
  STILL_SMALL: 'w185',
  STILL_MEDIUM: 'w300',
  STILL_LARGE: 'w500',
  ORIGINAL: 'original',
};

// Error Messages
export const ERROR_MESSAGES = {
  API_ERROR: 'Failed to fetch data from TMDb. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  NO_RESULTS: 'No results found. Try a different search term.',
  INVALID_API_KEY: 'Invalid API key. Please check your configuration.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  SHOW_NOT_FOUND: 'TV show not found.',
  SEASON_NOT_FOUND: 'Season data not available.',
};

export default {
  API_CONFIG,
  UI_CONFIG,
  IMAGE_SIZES,
  ERROR_MESSAGES,
};
