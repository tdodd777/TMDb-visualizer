import { getRatingColor } from '../utils/colorScale';

/**
 * Process seasons data from TMDb API into heatmap-ready format
 * @param {Array} seasonsData - Array of season objects from TMDb
 * @returns {Object} Processed heatmap data
 */
export function processHeatmapData(seasonsData) {
  if (!seasonsData || seasonsData.length === 0) {
    return {
      maxEpisodes: 0,
      seasons: [],
      stats: {
        totalEpisodes: 0,
        averageRating: 0,
        highestRated: null,
        lowestRated: null,
      },
    };
  }

  // Process each season
  const processedSeasons = seasonsData.map(season => {
    const episodes = (season.episodes || []).map(ep => ({
      episodeNumber: ep.episode_number,
      name: ep.name,
      airDate: ep.air_date,
      rating: ep.vote_average || 0,
      voteCount: ep.vote_count || 0,
      overview: ep.overview || '',
      stillPath: ep.still_path,
      color: getRatingColor(ep.vote_average, ep.vote_count),
    }));

    return {
      seasonNumber: season.season_number,
      name: season.name,
      airDate: season.air_date,
      episodes,
      episodeCount: episodes.length,
    };
  });

  // Calculate max episodes across all seasons
  const maxEpisodes = Math.max(
    ...processedSeasons.map(s => s.episodeCount),
    0
  );

  // Calculate statistics
  const allEpisodesWithSeason = processedSeasons.flatMap(s =>
    s.episodes.map(ep => ({ ...ep, seasonNumber: s.seasonNumber }))
  );
  const ratedEpisodes = allEpisodesWithSeason.filter(ep => ep.rating > 0 && ep.voteCount > 0);

  const totalEpisodes = allEpisodesWithSeason.length;
  const averageRating = ratedEpisodes.length > 0
    ? ratedEpisodes.reduce((sum, ep) => sum + ep.rating, 0) / ratedEpisodes.length
    : 0;

  const highestRated = ratedEpisodes.length > 0
    ? ratedEpisodes.reduce((max, ep) =>
        ep.rating > max.rating ? ep : max
      )
    : null;

  const lowestRated = ratedEpisodes.length > 0
    ? ratedEpisodes.reduce((min, ep) =>
        ep.rating < min.rating ? ep : min
      )
    : null;

  return {
    maxEpisodes,
    seasons: processedSeasons,
    stats: {
      totalEpisodes,
      averageRating: parseFloat(averageRating.toFixed(2)),
      highestRated,
      lowestRated,
      ratedEpisodeCount: ratedEpisodes.length,
    },
  };
}

/**
 * Get episode by season and episode number
 * @param {Object} heatmapData - Processed heatmap data
 * @param {number} seasonNumber - Season number
 * @param {number} episodeNumber - Episode number
 * @returns {Object|null} Episode object or null if not found
 */
export function getEpisode(heatmapData, seasonNumber, episodeNumber) {
  const season = heatmapData.seasons.find(s => s.seasonNumber === seasonNumber);
  if (!season) return null;

  return season.episodes.find(ep => ep.episodeNumber === episodeNumber) || null;
}

export default {
  processHeatmapData,
  getEpisode,
};
