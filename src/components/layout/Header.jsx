import React from 'react';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const { resetShow, selectedShow, browseTopRated, browsePopular, selectRandomShow } = useApp();

  const handleLogoClick = () => {
    resetShow();
  };

  const handleTopRated = () => {
    resetShow();
    browseTopRated();
  };

  const handlePopular = () => {
    resetShow();
    browsePopular();
  };

  const handleRandom = () => {
    selectRandomShow();
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <button
              onClick={handleLogoClick}
              className={`text-left ${
                selectedShow
                  ? 'cursor-pointer hover:text-blue-400 transition-colors'
                  : 'cursor-default'
              }`}
              disabled={!selectedShow}
            >
              <h1 className="text-xl md:text-2xl font-bold text-white">
                📺 TV Series Heatmap
              </h1>
              <p className="text-gray-400 text-xs md:text-sm">
                Visualize episode ratings for your favorite TV shows
              </p>
            </button>
          </div>

          {/* Browse Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTopRated}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm rounded transition-colors font-medium"
            >
              Top 100
            </button>
            <button
              onClick={handlePopular}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs md:text-sm rounded transition-colors font-medium"
            >
              Popular Now
            </button>
            <button
              onClick={handleRandom}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs md:text-sm rounded transition-colors font-medium"
            >
              🎲 Random
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
