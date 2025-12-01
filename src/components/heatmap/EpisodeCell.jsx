import React, { useState } from 'react';
import { formatRating } from '../../utils/formatters';
import { getRatingLabel } from '../../utils/colorScale';
import EpisodeTooltip from './EpisodeTooltip';

const EpisodeCell = ({ episode, seasonNumber, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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
          hover:scale-105 hover:brightness-110
          transition-all duration-200
          cursor-pointer
          rounded-sm
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900
        `}
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
