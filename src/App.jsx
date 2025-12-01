import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import SearchBar from './components/search/SearchBar';
import SearchResults from './components/search/SearchResults';
import ShowMetadata from './components/show/ShowMetadata';
import Heatmap from './components/heatmap/Heatmap';
import Modal from './components/ui/Modal';
import TrendingCarousel from './components/home/TrendingCarousel';

function AppContent() {
  const { selectedShow, searchResults, selectedEpisode, isModalOpen, closeModal } = useApp();

  return (
    <Layout>
      {!selectedShow ? (
        // Search view
        <div>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Discover Episode Ratings at a Glance
            </h2>
            <p className="text-gray-400">
              Search for your favorite TV series and visualize episode ratings as an interactive heatmap.
              See which episodes are fan favorites and which ones missed the mark.
            </p>
          </div>

          <SearchBar />

          {/* Show trending carousel only when no search results */}
          {searchResults.length === 0 && <TrendingCarousel />}

          <SearchResults />
        </div>
      ) : (
        // Show heatmap view
        <div>
          <ShowMetadata />
          <Heatmap />
        </div>
      )}

      {/* Episode details modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        episode={selectedEpisode}
      />
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
