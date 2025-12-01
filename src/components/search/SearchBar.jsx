import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { getImageUrl } from '../../services/tmdb';
import { formatYear, formatRating } from '../../utils/formatters';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, searchShows, isSearching, clearSearch, searchResults, selectShow } = useApp();
  const [localQuery, setLocalQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimeout = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Get top suggestions (limit to 8)
  const suggestions = searchResults.slice(0, 8);

  // Sync localQuery with searchQuery when it changes externally (e.g., from browse buttons or back navigation)
  useEffect(() => {
    // Only update localQuery if searchQuery was set externally (not from our own debounced search)
    if (searchQuery && searchQuery !== localQuery) {
      setLocalQuery(searchQuery);
    }
  }, [searchQuery, localQuery]);

  // Debounced search - only trigger for user-typed queries, not browse queries
  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Don't trigger searches for browse queries (Top 100, Popular Now, etc.)
    const isBrowseQuery = localQuery === 'Top 100 TV Shows' || localQuery === 'Popular Now';
    const isSearchQueryBrowse = searchQuery === 'Top 100 TV Shows' || searchQuery === 'Popular Now';

    // Set new timeout
    if (localQuery.length >= 2 && !isBrowseQuery) {
      debounceTimeout.current = setTimeout(() => {
        setSearchQuery(localQuery);
        searchShows(localQuery);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      }, 500);
    } else if (localQuery.length === 0) {
      // Only clear search if searchQuery is not a browse query
      // This prevents clearing when browse buttons set searchQuery externally
      if (searchQuery && !isSearchQueryBrowse) {
        clearSearch();
      }
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [localQuery, searchShows, clearSearch, setSearchQuery, searchQuery]);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setLocalQuery('');
    clearSearch();
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSelectShow = (show) => {
    selectShow(show);
    setLocalQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectShow(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => localQuery.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search for a TV series... (e.g., Breaking Bad, Succession)"
          className="w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          autoComplete="off"
        />

        {/* Clear button */}
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
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
        )}

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {suggestions.map((show, index) => {
              const posterUrl = getImageUrl(show.poster_path, 'w185');
              const year = formatYear(show.first_air_date);
              const rating = formatRating(show.vote_average);
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={show.id}
                  onClick={() => handleSelectShow(show)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors text-left ${
                    isSelected ? 'bg-gray-700' : ''
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {/* Poster thumbnail */}
                  <div className="flex-shrink-0 w-12 h-16 bg-gray-900 rounded overflow-hidden">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={show.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-700"
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
                  </div>

                  {/* Show info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {show.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      {year && <span>{year}</span>}
                      {show.vote_average > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-500">⭐ {rating}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow indicator for selected item */}
                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-blue-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}

            {/* "View all results" hint */}
            {searchResults.length > 8 && (
              <div className="border-t border-gray-700 p-3 text-center text-sm text-gray-400">
                {searchResults.length - 8} more result{searchResults.length - 8 !== 1 ? 's' : ''} available - press ESC to view all
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-sm text-gray-500 mt-2 text-center">
        {showSuggestions ? 'Use ↑↓ to navigate, Enter to select, ESC to close' : 'Start typing to search for TV series'}
      </p>
    </div>
  );
};

export default SearchBar;
