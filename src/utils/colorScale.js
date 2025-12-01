/**
 * Get Tailwind CSS background color class based on episode rating
 * TMDb scale: 1-10 (10 = best, 1 = worst)
 * @param {number} rating - Episode rating (0-10)
 * @param {number} voteCount - Number of votes
 * @returns {string} Tailwind CSS color class
 */
export function getRatingColor(rating, voteCount = 1) {
  // No rating or zero votes
  if (!rating || voteCount === 0) {
    return 'bg-gray-300';
  }

  // TMDb-style color scale matching Breaking Bad reference
  // Green shades = good, Yellow/Orange = mediocre, Red/Purple = bad
  if (rating >= 9.5) return 'bg-green-500';      // Awesome: 9.5-10.0
  if (rating >= 9.0) return 'bg-green-500';      // Awesome: 9.0-9.4
  if (rating >= 8.5) return 'bg-green-400';      // Great: 8.5-8.9
  if (rating >= 8.0) return 'bg-green-400';      // Great: 8.0-8.4
  if (rating >= 7.5) return 'bg-yellow-400';     // Good: 7.5-7.9
  if (rating >= 7.0) return 'bg-yellow-400';     // Good: 7.0-7.4
  if (rating >= 6.0) return 'bg-orange-400';     // Regular: 6.0-6.9
  if (rating >= 5.0) return 'bg-orange-500';     // Regular: 5.0-5.9
  if (rating >= 4.0) return 'bg-red-500';        // Bad: 4.0-4.9
  if (rating >= 3.0) return 'bg-red-600';        // Bad: 3.0-3.9
  return 'bg-purple-600';                        // Garbage: 0.0-2.9
}

/**
 * Get rating label for accessibility
 * @param {number} rating - Episode rating (0-10, where 10 is best)
 * @returns {string} Rating label
 */
export function getRatingLabel(rating) {
  if (!rating) return 'No rating';
  if (rating >= 9.0) return 'Awesome';
  if (rating >= 8.0) return 'Great';
  if (rating >= 7.0) return 'Good';
  if (rating >= 5.0) return 'Regular';
  if (rating >= 3.0) return 'Bad';
  return 'Garbage';
}

/**
 * Get color scale legend data
 * @returns {Array} Legend items with color, range, and label
 */
export function getColorScaleLegend() {
  return [
    { color: 'bg-green-500', range: '9.0 - 10', label: 'Awesome' },
    { color: 'bg-green-400', range: '8.0 - 8.9', label: 'Great' },
    { color: 'bg-yellow-400', range: '7.0 - 7.9', label: 'Good' },
    { color: 'bg-orange-400', range: '6.0 - 6.9', label: 'Regular' },
    { color: 'bg-orange-500', range: '5.0 - 5.9', label: 'Regular' },
    { color: 'bg-red-500', range: '3.0 - 4.9', label: 'Bad' },
    { color: 'bg-purple-600', range: '0.0 - 2.9', label: 'Garbage' },
    { color: 'bg-gray-300', range: '-', label: 'No Rating' },
  ];
}

export default {
  getRatingColor,
  getRatingLabel,
  getColorScaleLegend,
};
