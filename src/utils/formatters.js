import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a date string from TMDb
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @param {string} formatString - Format string for date-fns
 * @returns {string} Formatted date or empty string
 */
export function formatDate(dateString, formatString = 'MMMM d, yyyy') {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Format rating with one decimal place
 * @param {number} rating - Rating value
 * @returns {string} Formatted rating
 */
export function formatRating(rating) {
  if (!rating || rating === 0) return 'N/A';
  return rating.toFixed(1);
}

/**
 * Format vote count with commas
 * @param {number} count - Vote count
 * @returns {string} Formatted count
 */
export function formatVoteCount(count) {
  if (!count || count === 0) return '0';
  return count.toLocaleString();
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Format year from date string
 * @param {string} dateString - ISO date string
 * @returns {string} Year or empty string
 */
export function formatYear(dateString) {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, 'yyyy');
  } catch (error) {
    return '';
  }
}

/**
 * Format season and episode number (e.g., "S01E05")
 * @param {number} season - Season number
 * @param {number} episode - Episode number
 * @returns {string} Formatted season/episode
 */
export function formatSeasonEpisode(season, episode) {
  const s = String(season).padStart(2, '0');
  const e = String(episode).padStart(2, '0');
  return `S${s}E${e}`;
}

export default {
  formatDate,
  formatRating,
  formatVoteCount,
  truncateText,
  formatYear,
  formatSeasonEpisode,
};
