import React, { createContext, useContext, useState, useCallback } from 'react';
import { searchShows as apiSearchShows, getShowDetails, getAllSeasons, getWatchProviders, getTopRatedShows, getPopularShows, getRandomShow } from '../services/tmdb';
import { getCacheShow, setCacheShow, getCacheSeason, setCacheSeason, getCacheSearch, setCacheSearch } from '../services/cache';
import { processHeatmapData } from '../services/ratingProcessor';
import { logger } from '../utils/logger';

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

  // Navigation history (back/forward stack)
  const [navigationStack, setNavigationStack] = useState([]); // Array of view states
  const [navigationIndex, setNavigationIndex] = useState(-1); // Current position in stack
  const [previousView, setPreviousView] = useState(null); // 'search', 'top100', 'popular', or null
  const [previousResults, setPreviousResults] = useState([]);
  const [previousQuery, setPreviousQuery] = useState('');

  // Search TV shows
  const searchShows = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    // Save current state to navigation stack before new search
    if (searchResults.length > 0 || selectedShow) {
      const currentState = {
        type: selectedShow ? 'show' : 'search',
        searchResults,
        searchQuery,
        selectedShow,
      };

      setNavigationStack(prev => {
        const newStack = prev.slice(0, navigationIndex + 1);
        return [...newStack, currentState];
      });
      setNavigationIndex(prev => prev + 1);
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Check cache first
      const cached = getCacheSearch(query);
      if (cached) {
        // Sort by popularity (descending) to surface more relevant results
        // Spread to create a copy - .sort() mutates in place which can cause re-render loops
        const sortedResults = [...(cached.results || [])].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        setSearchResults(sortedResults);
        setIsSearching(false);
        return;
      }

      // Fetch from API
      const data = await apiSearchShows(query);
      // Sort by popularity (descending) to surface more relevant results
      // Spread to create a copy - .sort() mutates in place which can cause re-render loops
      const sortedResults = [...(data.results || [])].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      setSearchResults(sortedResults);

      // Cache results (sorted)
      setCacheSearch(query, { ...data, results: sortedResults });
    } catch (error) {
      logger.error('Search error:', error);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [navigationIndex, searchResults, searchQuery, selectedShow]);

  // Select a show and fetch all data
  const selectShow = useCallback(async (show) => {
    // Save current view state to navigation stack before navigating
    if (searchResults.length > 0 || !selectedShow) {
      const currentState = {
        type: 'search',
        searchResults,
        searchQuery,
        selectedShow: null,
      };

      // Add to navigation stack
      setNavigationStack(prev => {
        // Remove any forward history if we're not at the end
        const newStack = prev.slice(0, navigationIndex + 1);
        return [...newStack, currentState];
      });
      setNavigationIndex(prev => prev + 1);

      // Keep legacy support
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
      logger.error('Error loading show:', error);
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
    // Save current state to navigation stack
    const currentState = {
      type: selectedShow ? 'show' : 'home',
      searchResults,
      searchQuery,
      selectedShow,
    };

    setNavigationStack(prev => {
      const newStack = prev.slice(0, navigationIndex + 1);
      return [...newStack, currentState];
    });
    setNavigationIndex(prev => prev + 1);

    // Clear selected show
    setSelectedShow(null);
    setShowDetails(null);
    setSeasonsData([]);
    setHeatmapData(null);
    setWatchProviders(null);
    setShowError(null);

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
      logger.error('Browse top rated error:', error);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [navigationIndex, selectedShow, searchResults, searchQuery]);

  // Browse popular shows
  const browsePopular = useCallback(async () => {
    // Save current state to navigation stack
    const currentState = {
      type: selectedShow ? 'show' : 'home',
      searchResults,
      searchQuery,
      selectedShow,
    };

    setNavigationStack(prev => {
      const newStack = prev.slice(0, navigationIndex + 1);
      return [...newStack, currentState];
    });
    setNavigationIndex(prev => prev + 1);

    // Clear selected show
    setSelectedShow(null);
    setShowDetails(null);
    setSeasonsData([]);
    setHeatmapData(null);
    setWatchProviders(null);
    setShowError(null);

    setIsSearching(true);
    setSearchError(null);
    setSearchQuery('Popular Now');

    try {
      const data = await getPopularShows(1);
      setSearchResults(data.results || []);
    } catch (error) {
      logger.error('Browse popular error:', error);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [navigationIndex, selectedShow, searchResults, searchQuery]);

  // Get random show and select it
  const selectRandomShow = useCallback(async () => {
    // Save current state to navigation stack
    const currentState = {
      type: selectedShow ? 'show' : 'home',
      searchResults,
      searchQuery,
      selectedShow,
    };

    setNavigationStack(prev => {
      const newStack = prev.slice(0, navigationIndex + 1);
      return [...newStack, currentState];
    });
    setNavigationIndex(prev => prev + 1);

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
      logger.error('Random show error:', error);
      setSearchError(error.message);
      setShowError(error.message);
    } finally {
      setIsSearching(false);
      setIsLoadingShow(false);
    }
  }, [navigationIndex, selectedShow, searchResults, searchQuery]);

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

  // Go to home page (complete reset)
  const goHome = useCallback(() => {
    // Clear selected show
    setSelectedShow(null);
    setShowDetails(null);
    setSeasonsData([]);
    setHeatmapData(null);
    setWatchProviders(null);
    setShowError(null);

    // Clear search state
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);

    // Clear navigation history
    setPreviousView(null);
    setPreviousResults([]);
    setPreviousQuery('');
    setNavigationStack([]);
    setNavigationIndex(-1);
  }, []);

  // Go back in navigation history
  const goBack = useCallback(() => {
    // Use navigation stack if available
    if (navigationIndex > 0) {
      const prevState = navigationStack[navigationIndex - 1];
      setNavigationIndex(prev => prev - 1);

      // Restore state
      setSearchResults(prevState.searchResults || []);
      setSearchQuery(prevState.searchQuery || '');
      setSelectedShow(prevState.selectedShow || null);
      setShowDetails(null);
      setSeasonsData([]);
      setHeatmapData(null);
      setWatchProviders(null);
      setShowError(null);

      return true;
    }

    // Fallback to legacy navigation
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

      return true;
    }

    // Final fallback: if we're not on home, go to home
    if (selectedShow || searchResults.length > 0 || searchQuery) {
      // Clear selected show
      setSelectedShow(null);
      setShowDetails(null);
      setSeasonsData([]);
      setHeatmapData(null);
      setWatchProviders(null);
      setShowError(null);

      // Clear search state
      setSearchQuery('');
      setSearchResults([]);
      setSearchError(null);

      return true;
    }

    return false;
  }, [navigationIndex, navigationStack, previousView, previousResults, previousQuery, selectedShow, searchResults, searchQuery]);

  // Go forward in navigation history
  const goForward = useCallback(() => {
    if (navigationIndex < navigationStack.length - 1) {
      const nextState = navigationStack[navigationIndex + 1];
      setNavigationIndex(prev => prev + 1);

      // Restore state
      setSearchResults(nextState.searchResults || []);
      setSearchQuery(nextState.searchQuery || '');
      setSelectedShow(nextState.selectedShow || null);
      setShowDetails(null);
      setSeasonsData([]);
      setHeatmapData(null);
      setWatchProviders(null);
      setShowError(null);

      return true;
    }

    return false;
  }, [navigationIndex, navigationStack]);

  // Check if can go back/forward
  const canGoBack = navigationIndex > 0 ||
                    (previousView && previousResults.length > 0) ||
                    selectedShow !== null ||
                    searchResults.length > 0 ||
                    searchQuery !== '';
  const canGoForward = navigationIndex < navigationStack.length - 1;

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
    goHome,

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
    goForward,
    canGoBack,
    canGoForward,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
