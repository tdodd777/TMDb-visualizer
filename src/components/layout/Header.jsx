import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const { goHome, browseTopRated, browsePopular, selectRandomShow } = useApp();
  const [showLightModeDialog, setShowLightModeDialog] = useState(false);

  const handleLogoClick = () => {
    goHome();
  };

  const handleTopRated = () => {
    browseTopRated();
  };

  const handlePopular = () => {
    browsePopular();
  };

  const handleRandom = () => {
    selectRandomShow();
  };

  const handleThemeToggle = () => {
    setShowLightModeDialog(true);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 py-2 md:py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo - always visible */}
          <button
            onClick={handleLogoClick}
            className="text-left cursor-pointer hover:opacity-80 transition-opacity group flex items-center gap-2"
            aria-label="Go to home page"
          >
            <img
              src="/images/showgrid-logo.svg"
              alt="ShowGrid Logo"
              className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0"
            />
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                ShowGrid
              </h1>
              {/* Hide tagline on mobile */}
              <p className="hidden md:block text-gray-400 text-xs lg:text-sm">
                Visualize TV series ratings at a glance
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {/* Desktop buttons (768px+) */}
            <div className="hidden md:flex items-center gap-2">
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

            {/* Theme toggle button - always visible in top right */}
            <button
              onClick={handleThemeToggle}
              className="tap-target p-2 text-yellow-400 hover:text-yellow-300 active:text-yellow-500 transition-colors"
              aria-label="Toggle theme"
              title="Toggle light/dark mode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile buttons - always visible */}
        <div className="md:hidden mt-3 pb-2 flex flex-col gap-2">
          <button
            onClick={handleTopRated}
            className="w-full tap-target px-4 py-3 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-sm rounded transition-colors font-medium text-left"
          >
            Top 100
          </button>
          <button
            onClick={handlePopular}
            className="w-full tap-target px-4 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm rounded transition-colors font-medium text-left"
          >
            Popular Now
          </button>
          <button
            onClick={handleRandom}
            className="w-full tap-target px-4 py-3 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-white text-sm rounded transition-colors font-medium text-left"
          >
            Random
          </button>
        </div>
      </div>

      {/* Light mode coming soon dialog */}
      {showLightModeDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowLightModeDialog(false)}
        >
          <div
            className="bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-2xl border border-gray-700 animate-card-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Light Mode Coming Soon!
            </h3>
            <p className="text-gray-500 text-center text-sm italic mb-6">
              Although, I definitely think dark mode is better
            </p>
            <button
              onClick={() => setShowLightModeDialog(false)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
