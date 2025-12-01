import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-2 mt-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-2 text-xs text-gray-500">
          {/* TMDb Attribution - Compact */}
          <div className="flex items-center gap-2">
            <img
              src="/images/tmdb-logo.svg"
              alt="TMDb"
              className="h-4 w-auto opacity-60"
            />
            <span>This product uses the TMDb API but is not endorsed or certified by TMDb.</span>
          </div>

          {/* Copyright */}
          <p>© {new Date().getFullYear()} TV Series Heatmap</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
