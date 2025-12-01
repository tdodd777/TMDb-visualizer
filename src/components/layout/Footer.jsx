import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-3 mt-2 md:mt-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-400">
          <span>Site by</span>
          <a
            href="https://tylerdodd.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors underline"
          >
            Tyler Dodd
          </a>
          <span>|</span>
          <span>Data from</span>
          <img
            src="/images/tmdb-logo.svg"
            alt="TMDb"
            className="h-3 w-auto opacity-70 inline-block"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
