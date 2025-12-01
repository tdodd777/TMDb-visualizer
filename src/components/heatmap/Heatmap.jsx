import React from 'react';
import { useApp } from '../../context/AppContext';
import HeatmapLegend from './HeatmapLegend';
import HeatmapGrid from './HeatmapGrid';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

const Heatmap = () => {
  const { heatmapData, isLoadingShow, showError, selectShow, selectedShow } = useApp();

  if (isLoadingShow) {
    return <LoadingSpinner size="lg" message="Loading episode ratings..." />;
  }

  if (showError) {
    return (
      <ErrorMessage
        message={showError}
        onRetry={() => selectedShow && selectShow(selectedShow)}
      />
    );
  }

  if (!heatmapData) {
    return null;
  }

  return (
    <div>
      {/* Heatmap Grid First */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 mb-2 md:mb-3">
        <HeatmapGrid />
      </div>

      {/* Legend */}
      <HeatmapLegend />

      {/* Stats */}
      {heatmapData.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 md:mt-3">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-0.5">Total Episodes</p>
            <p className="text-base md:text-lg font-bold text-white">
              {heatmapData.stats.totalEpisodes}
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-0.5">Average Rating</p>
            <p className="text-base md:text-lg font-bold text-yellow-500">
              ⭐ {heatmapData.stats.averageRating.toFixed(1)}
            </p>
          </div>

          {heatmapData.stats.highestRated && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
              <p className="text-xs text-gray-400 mb-0.5">Highest Rated</p>
              <p className="text-base font-bold text-green-500">
                {heatmapData.stats.highestRated.rating.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">
                S{String(heatmapData.stats.highestRated.seasonNumber).padStart(2, '0')}E{String(heatmapData.stats.highestRated.episodeNumber).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {heatmapData.stats.highestRated.name}
              </p>
            </div>
          )}

          {heatmapData.stats.lowestRated && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
              <p className="text-xs text-gray-400 mb-0.5">Lowest Rated</p>
              <p className="text-base md:text-lg font-bold text-orange-500">
                {heatmapData.stats.lowestRated.rating.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">
                S{String(heatmapData.stats.lowestRated.seasonNumber).padStart(2, '0')}E{String(heatmapData.stats.lowestRated.episodeNumber).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {heatmapData.stats.lowestRated.name}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Heatmap;
