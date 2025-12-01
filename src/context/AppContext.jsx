import React, { createContext, useContext, useState, useCallback } from 'react';
import { searchShows as apiSearchShows, getShowDetails, getAllSeasons, getWatchProviders, getTopRatedShows, getPopularShows, getRandomShow } from '../services/tmdb';
import { getCacheShow, setCacheShow, getCacheSeason, setCacheSeason, getCacheSearch, setCacheSearch } from '../services/cache';
import { processHeatmapData } from '../services/ratingProcessor';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Selected show state
  const [selectedShow, setSelectedShow] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [seasonsData, setSeasonsData] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);
  const [isLoadingShow, setIsLoadingShow] = useState(false);
  const [showError, setShowError] = useState(null);

  // Heatmap state
  const [heatmapData, setHeatmapData] = useState(null);

  // UI state
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Navigation history
  const [previousView, setPreviousView] = useState(null); // 'search', 'top100', 'popular', or null
  const [previousResults, setPreviousResults] = useState([]);
  const [previousQuery, setPreviousQuery] = useState('');

  // Search TV shows
  const searchShows = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Check cache first
      const cached = getCacheSearch(query);
      if (cached) {
        setSearchResults(cached.results || []);
        setIsSearching(false);
        return;
      }

      // Fetch from API
      const data = await apiSearchShows(query);
      setSearchResults(data.results || []);

      // Cache results
      setCacheSearch(query, data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Select a show and fetch all data
  const selectShow = useCallback(async (show) => {
    // Save current view state before navigating
    if (searchResults.length > 0) {
      setPreviousResults(searchResults);
      setPreviousQuery(searchQuery);

      // Determine view type based on searchQuery
      if (searchQuery === 'Top 100 TV Shows') {
        setPreviousView('top100');
      } else if (searchQuery === 'Popular Now') {
        setPreviousView('popular');
      } else if (searchQuery) {
        setPreviousView('search');
      }
    }

    setSelectedShow(show);
    setIsLoadingShow(true);
    setShowError(null);
    setHeatmapData(null);
    setSeasonsData([]);
    setWatchProviders(null);

    try {
      // Check cache for show details
      let details = getCacheShow(show.id);
      if (!details) {
        details = await getShowDetails(show.id);
        setCacheShow(show.id, details);
      }
      setShowDetails(details);

      // Fetch watch providers (streaming availability)
      const providers = await getWatchProviders(show.id);
      setWatchProviders(providers);

      // Fetch all seasons
      const seasonCount = details.number_of_seasons;
      const seasons = [];

      for (let i = 1; i <= seasonCount; i++) {
        // Check cache for each season
        let seasonData = getCacheSeason(show.id, i);
        if (!seasonData) {
          seasonData = await getAllSeasons(show.id, seasonCount);
          // Cache each season
          seasonData.forEach((s, index) => {
            setCacheSeason(show.id, index + 1, s);
          });
          break; // getAllSeasons fetches all at once
        }
        seasons.push(seasonData);
      }

      // If we didn't break out (all from cache), use those
      const finalSeasons = seasons.length > 0 ? seasons : await getAllSeasons(show.id, seasonCount);

      setSeasonsData(finalSeasons);

      // Process heatmap data
      const processed = processHeatmapData(finalSeasons);
      setHeatmapData(processed);

    } catch (error) {
      console.error('Error loading show:', error);
      setShowError(error.message);
    } finally {
      setIsLoadingShow(false);
    }
  }, [searchResults, searchQuery]);

  // Select an episode (for modal)
  const selectEpisode = useCallback((episode, seasonNumber) => {
    setSelectedEpisode({ ...episode, seasonNumber });
    setIsModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEpisode(null);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  }, []);

  // Browse top rated shows
  const browseTopRated = useCallback(async () => {
    setIsSearching(true);
    setSearchError(null);
    setSearchQuery('Top 100 TV Shows');

    try {
      // Fetch first 5 pages to get ~100 shows
      const pages = await Promise.all([
        getTopRatedShows(1),
        getTopRatedShows(2),
        getTopRatedShows(3),
        getTopRatedShows(4),
        getTopRatedShows(5),
      ]);

      const allShows = pages.flatMap(page => page.results || []);
      setSearchResults(allShows.slice(0, 100));
    } catch (error) {
      console.error('Browse top rated error:', error);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Browse popular shows
  const browsePopular = useCallback(async () => {
    setIsSearching(true);
    setSearchError(null);
    setSearchQuery('Popular Now');

    try {
      const data = await getPopularShows(1);
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Browse popular error:', error);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Get random show and select it
  const selectRandomShow = useCallback(async () => {
    setIsSearching(true);
    setSearchError(null);
    setIsLoadingShow(true);
    setHeatmapData(null);
    setSeasonsData([]);
    setWatchProviders(null);
    setShowError(null);

    try {
      const randomShow = await getRandomShow();
      setSelectedShow(randomShow);

      // Fetch show details
      let details = getCacheShow(randomShow.id);
      if (!details) {
        details = await getShowDetails(randomShow.id);
        setCacheShow(randomShow.id, details);
      }
      setShowDetails(details);

      // Fetch watch providers
      const providers = await getWatchProviders(randomShow.id);
      setWatchProviders(providers);

      // Fetch all seasons
      const seasonCount = details.number_of_seasons;
      const seasons = [];

      for (let i = 1; i <= seasonCount; i++) {
        let seasonData = getCacheSeason(randomShow.id, i);
        if (!seasonData) {
          seasonData = await getAllSeasons(randomShow.id, seasonCount);
          seasonData.forEach((s, index) => {
            setCacheSeason(randomShow.id, index + 1, s);
          });
          break;
        }
        seasons.push(seasonData);
      }

      const finalSeasons = seasons.length > 0 ? seasons : await getAllSeasons(randomShow.id, seasonCount);
      setSeasonsData(finalSeasons);

      const processed = processHeatmapData(finalSeasons);
      setHeatmapData(processed);

    } catch (error) {
      console.error('Random show error:', error);
      setSearchError(error.message);
      setShowError(error.message);
    } finally {
      setIsSearching(false);
      setIsLoadingShow(false);
    }
  }, []);

  // Reset show selection
  const resetShow = useCallback(() => {
    setSelectedShow(null);
    setShowDetails(null);
    setSeasonsData([]);
    setHeatmapData(null);
    setWatchProviders(null);
    setShowError(null);
    setPreviousView(null);
    setPreviousResults([]);
    setPreviousQuery('');
  }, []);

  // Go back to previous view
  const goBack = useCallback(() => {
    if (previousView && previousResults.length > 0) {
      // Restore previous view state
      setSearchResults(previousResults);
      setSearchQuery(previousQuery);

      // Clear show selection
      setSelectedShow(null);
      setShowDetails(null);
      setSeasonsData([]);
      setHeatmapData(null);
      setWatchProviders(null);
      setShowError(null);

      // Clear navigation history
      setPreviousView(null);
      setPreviousResults([]);
      setPreviousQuery('');
    }
  }, [previousView, previousResults, previousQuery]);

  const value = {
    // Search
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    searchShows,
    clearSearch,

    // Browse
    browseTopRated,
    browsePopular,
    selectRandomShow,

    // Show
    selectedShow,
    showDetails,
    seasonsData,
    watchProviders,
    isLoadingShow,
    showError,
    selectShow,
    resetShow,

    // Heatmap
    heatmapData,

    // Episode modal
    selectedEpisode,
    isModalOpen,
    selectEpisode,
    closeModal,

    // Navigation
    previousView,
    goBack,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
