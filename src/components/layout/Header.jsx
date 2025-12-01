import React from 'react';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const { goHome, browseTopRated, browsePopular, selectRandomShow } = useApp();

  const handleLogoClick = () => {
    goHome();
  };

  const handleTopRated = () => {
    goHome();
    browseTopRated();
  };

  const handlePopular = () => {
    goHome();
    browsePopular();
  };

  const handleRandom = () => {
    selectRandomShow();
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <button
              onClick={handleLogoClick}
              className="text-left cursor-pointer hover:opacity-80 transition-opacity group flex items-center gap-3"
              aria-label="Go to home page"
            >
              {/* Logo */}
              <img
                src="/images/showgrid-logo.svg"
                alt="ShowGrid Logo"
                className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0"
              />

              {/* Text */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  ShowGrid
                </h1>
                <p className="text-gray-400 text-xs md:text-sm">
                  Visualize TV series ratings at a glance
                </p>
              </div>
            </button>
          </div>

          {/* Browse Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTopRated}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs md:text-sm rounded transition-colors font-medium"
            >
              Top 100
            </button>
            <button
              onClick={handlePopular}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm rounded transition-colors font-medium"
            >
              Popular Now
            </button>
            <button
              onClick={handleRandom}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-white text-xs md:text-sm rounded transition-colors font-medium"
            >
              Random
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
