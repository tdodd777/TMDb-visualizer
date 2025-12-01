import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getImageUrl } from '../../services/tmdb';
import { formatYear, formatRating } from '../../utils/formatters';
import SearchSkeleton from '../ui/SearchSkeleton';

const SearchResults = () => {
  const { searchResults, isSearching, searchError, selectShow, searchQuery } = useApp();
  const [showResults, setShowResults] = useState(false);
  const [showContainer, setShowContainer] = useState(false);

  // First: transition from skeleton to container
  useEffect(() => {
    if (!isSearching && searchResults.length > 0) {
      const timer = setTimeout(() => setShowContainer(true), 100);
      return () => {
        clearTimeout(timer);
        setShowContainer(false);
      };
    } else {
      setShowContainer(false);
    }
  }, [isSearching, searchResults.length]);

  // Second: trigger staggered animation
  useEffect(() => {
    if (showContainer && searchResults.length > 0) {
      setShowResults(false);
      const timer = setTimeout(() => setShowResults(true), 50);
      return () => clearTimeout(timer);
    }
  }, [showContainer, searchResults]);

  // Return early if no search query - prevents skeleton from showing on homepage
  if (!searchQuery || searchQuery.length < 2) {
    return null;
  }

  if (isSearching || !showContainer) {
    return <SearchSkeleton />;
  }

  if (searchError) {
    return (
      <div className="mt-6 text-center text-red-400">
        <p>{searchError}</p>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-400">
        <svg
          className="w-16 h-16 mx-auto mb-3 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg">No results found for "{searchQuery}"</p>
        <p className="text-sm mt-1">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-gray-400 mb-4">
        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {searchResults.map((show, index) => {
          const posterUrl = getImageUrl(show.poster_path, 'w342');
          const year = formatYear(show.first_air_date);
          const rating = formatRating(show.vote_average);
          const staggerDelay = index * 300;

          return (
            <button
              key={show.id}
              onClick={() => selectShow(show)}
              className={`
                group bg-gray-800 rounded-lg overflow-hidden
                border border-gray-700 hover:border-blue-500
                transition-all hover:scale-105 transform text-left
                ${showResults ? 'animate-card-fade-in' : ''}
              `}
              style={{
                animationDelay: showResults ? `${staggerDelay}ms` : '0ms',
                opacity: showResults ? undefined : 0,
              }}
            >
              <div className="relative aspect-[2/3] bg-gray-900">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={show.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Rating overlay */}
                {show.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-500/90 text-gray-900 font-bold text-sm px-2 py-1 rounded">
                    ⭐ {rating}
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                  {show.name}
                </h3>
                {year && (
                  <p className="text-sm text-gray-400">{year}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
