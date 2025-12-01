import React, { useEffect } from 'react';
import { getImageUrl } from '../../services/tmdb';
import { formatDate, formatRating, formatVoteCount, formatSeasonEpisode } from '../../utils/formatters';

const Modal = ({ isOpen, onClose, episode }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !episode) return null;

  const stillUrl = getImageUrl(episode.stillPath, 'w500');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-900/80 hover:bg-gray-900 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Episode image */}
        {stillUrl && (
          <div className="relative w-full h-64 md:h-80 bg-gray-900">
            <img
              src={stillUrl}
              alt={episode.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent" />
          </div>
        )}

        {/* Episode details */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-blue-400 font-medium mb-1">
                  {formatSeasonEpisode(episode.seasonNumber, episode.episodeNumber)}
                </p>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {episode.name}
                </h2>
              </div>

              {/* Rating badge */}
              {episode.rating > 0 && (
                <div className="flex flex-col items-center bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg font-bold text-yellow-500">
                      {formatRating(episode.rating)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatVoteCount(episode.voteCount)} votes
                  </p>
                </div>
              )}
            </div>

            {/* Air date */}
            {episode.airDate && (
              <p className="text-sm text-gray-400 mt-2">
                Aired: {formatDate(episode.airDate)}
              </p>
            )}
          </div>

          {/* Overview */}
          {episode.overview && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
              <p className="text-gray-300 leading-relaxed">{episode.overview}</p>
            </div>
          )}

          {!episode.overview && (
            <p className="text-gray-500 italic">No synopsis available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
