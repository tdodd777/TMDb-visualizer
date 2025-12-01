import React, { useState } from 'react';
import { formatRating } from '../../utils/formatters';
import { getRatingLabel } from '../../utils/colorScale';
import EpisodeTooltip from './EpisodeTooltip';

const EpisodeCell = ({ episode, seasonNumber, onClick, rowIndex = 0, colIndex = 0, isLoaded = true }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Helper function to get glow class based on rating
  const getGlowClass = (rating) => {
    if (!rating) return '';
    if (rating >= 9.0) return 'glow-green';
    if (rating >= 7.0) return 'glow-yellow';
    if (rating >= 5.0) return 'glow-orange';
    if (rating >= 3.0) return 'glow-red';
    return 'glow-purple';
  };

  if (!episode) {
    // Empty cell for seasons with fewer episodes
    return <div className="w-full h-full bg-gray-800/30" />;
  }

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(episode, seasonNumber);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const ratingLabel = getRatingLabel(episode.rating);

  return (
    <>
      <button
        className={`
          ${episode.color}
          w-full h-full
          flex items-center justify-center
          text-xs font-bold text-gray-900
          hover:scale-110 hover:${getGlowClass(episode.rating)} hover:z-10
          transition-all duration-150
          cursor-pointer
          rounded-sm
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900
          ${isLoaded ? 'animate-cell-fill' : ''}
        `}
        style={{
          animationDelay: isLoaded ? `${(rowIndex * 30) + (colIndex * 15)}ms` : '0ms',
          opacity: isLoaded ? undefined : 0,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`Episode ${episode.episodeNumber}: ${episode.name}, Rating: ${formatRating(episode.rating)}, ${ratingLabel}`}
        tabIndex={0}
      >
        {episode.rating > 0 ? formatRating(episode.rating) : '—'}
      </button>

      {showTooltip && (
        <EpisodeTooltip
          episode={episode}
          seasonNumber={seasonNumber}
          position={tooltipPosition}
        />
      )}
    </>
  );
};

export default React.memo(EpisodeCell);
