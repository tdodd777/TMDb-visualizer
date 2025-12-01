import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatDate, formatRating, formatVoteCount, formatSeasonEpisode, truncateText } from '../../utils/formatters';
import { getRatingLabel } from '../../utils/colorScale';

const EpisodeTooltip = ({ episode, seasonNumber, position }) => {
  const [tooltipStyle, setTooltipStyle] = useState({});

  useEffect(() => {
    const tooltipWidth = 300;
    const tooltipOffset = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = position.x - tooltipWidth / 2;
    let top = position.y - tooltipOffset;

    // Adjust horizontal position if near edges
    if (left < 10) {
      left = 10;
    } else if (left + tooltipWidth > viewportWidth - 10) {
      left = viewportWidth - tooltipWidth - 10;
    }

    // Position above or below based on available space
    if (top < 200) {
      // Not enough space above, show below
      top = position.y + 50; // Cell height + offset
    }

    setTooltipStyle({
      left: `${left}px`,
      top: `${top}px`,
      transform: top < position.y ? 'translateY(-100%)' : 'translateY(0)',
    });
  }, [position]);

  const tooltipContent = (
    <div
      className="fixed z-50 pointer-events-none animate-fade-in"
      style={tooltipStyle}
    >
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-4 max-w-xs">
        {/* Episode title */}
        <div className="mb-2">
          <p className="text-xs text-blue-400 font-medium mb-1">
            {formatSeasonEpisode(seasonNumber, episode.episodeNumber)}
          </p>
          <h4 className="text-sm font-semibold text-white">
            {truncateText(episode.name, 50)}
          </h4>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-yellow-500">
              {formatRating(episode.rating)}
            </span>
            <span className="text-xs text-gray-400">
              ({formatVoteCount(episode.voteCount)} votes)
            </span>
          </div>
        </div>

        {/* Rating label */}
        <p className="text-xs text-gray-400 mb-2">
          {getRatingLabel(episode.rating)}
        </p>

        {/* Air date */}
        {episode.airDate && (
          <p className="text-xs text-gray-400 mb-2">
            Aired: {formatDate(episode.airDate)}
          </p>
        )}

        {/* Overview */}
        {episode.overview && (
          <p className="text-xs text-gray-300 leading-relaxed">
            {truncateText(episode.overview, 120)}
          </p>
        )}

        {!episode.overview && (
          <p className="text-xs text-gray-500 italic">No synopsis available</p>
        )}

        {/* Click hint */}
        <p className="text-xs text-gray-500 mt-2 italic">
          Click for details
        </p>
      </div>

      {/* Arrow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-l-transparent border-r-transparent"
        style={{
          bottom: tooltipStyle.transform?.includes('translateY(-100%)') ? '-8px' : 'auto',
          top: tooltipStyle.transform?.includes('translateY(0)') ? '-8px' : 'auto',
          borderTopColor: tooltipStyle.transform?.includes('translateY(-100%)') ? '#4b5563' : 'transparent',
          borderBottomColor: tooltipStyle.transform?.includes('translateY(0)') ? '#4b5563' : 'transparent',
          borderTopWidth: tooltipStyle.transform?.includes('translateY(-100%)') ? '8px' : '0',
          borderBottomWidth: tooltipStyle.transform?.includes('translateY(0)') ? '8px' : '0',
        }}
      />
    </div>
  );

  return createPortal(tooltipContent, document.body);
};

export default EpisodeTooltip;
