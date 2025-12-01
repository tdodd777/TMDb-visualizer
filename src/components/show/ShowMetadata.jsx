import React from 'react';
import { getImageUrl } from '../../services/tmdb';
import { formatYear, formatRating } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

const ShowMetadata = () => {
  const { showDetails, watchProviders, goBack, previousView } = useApp();

  if (!showDetails) return null;

  const posterUrl = getImageUrl(showDetails.poster_path, 'w500');
  const year = formatYear(showDetails.first_air_date);
  const rating = formatRating(showDetails.vote_average);

  // Get US streaming providers (you can change 'US' to other country codes)
  const usProviders = watchProviders?.results?.US;
  const streamingServices = usProviders?.flatrate || [];
  const buyServices = usProviders?.buy || [];
  const rentServices = usProviders?.rent || [];

  // Determine back button text based on previous view
  const getBackButtonText = () => {
    switch (previousView) {
      case 'top100':
        return '← Back to Top 100';
      case 'popular':
        return '← Back to Popular Now';
      case 'search':
        return '← Back to Search Results';
      default:
        return '← Back';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 mb-3 md:mb-4">
      {/* Back Button - Top Left */}
      {previousView && (
        <div className="p-2 border-b border-gray-700">
          <button
            onClick={goBack}
            className="w-full md:w-auto tap-target px-3 py-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-600 text-white rounded text-sm transition-colors font-medium inline-flex items-center justify-center md:justify-start gap-1"
          >
            {getBackButtonText()}
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Poster */}
        <div className="w-full md:w-40 flex-shrink-0">
          <div className="relative aspect-[2/3] bg-gray-900 max-w-[200px] md:max-w-none mx-auto md:mx-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={showDetails.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-gray-700"
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
        </div>

        {/* Details */}
        <div className="p-3 md:p-4 flex-grow">
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4 mb-2">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1 mobile-tight">
                {showDetails.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                {year && <span>{year}</span>}
                {showDetails.number_of_seasons && (
                  <>
                    <span>•</span>
                    <span>{showDetails.number_of_seasons} Season{showDetails.number_of_seasons !== 1 ? 's' : ''}</span>
                  </>
                )}
                {showDetails.number_of_episodes && (
                  <>
                    <span>•</span>
                    <span>{showDetails.number_of_episodes} Episodes</span>
                  </>
                )}
              </div>
            </div>

            {/* Rating */}
            {showDetails.vote_average > 0 && (
              <div className="flex flex-col items-center bg-yellow-500/20 border border-yellow-500/50 rounded px-2 py-1.5 md:px-3 md:py-2 self-start">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-lg font-bold text-yellow-500">
                    {rating}
                  </span>
                </div>
                <p className="text-xs text-gray-400">TMDb Rating</p>
              </div>
            )}
          </div>

          {/* Genres */}
          {showDetails.genres && showDetails.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {showDetails.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Networks */}
          {showDetails.networks && showDetails.networks.length > 0 && (
            <p className="text-xs text-gray-400 mb-2">
              Network: {showDetails.networks.map(n => n.name).join(', ')}
            </p>
          )}

          {/* Overview */}
          {showDetails.overview && (
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-white mb-1">Overview</h3>
              <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">{showDetails.overview}</p>
            </div>
          )}

          {/* Streaming Availability */}
          {(streamingServices.length > 0 || buyServices.length > 0 || rentServices.length > 0) && (
            <div className="mb-2 p-2 bg-gray-700/50 rounded border border-gray-600">
              <h3 className="text-xs font-semibold text-white mb-1.5">Where to Watch (US)</h3>

              {/* Streaming */}
              {streamingServices.length > 0 && (
                <div className="mb-1.5">
                  <p className="text-xs text-gray-400 mb-1">Stream</p>
                  <div className="flex flex-wrap gap-1.5">
                    {streamingServices.map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="flex items-center gap-1 md:gap-1.5 bg-gray-800 rounded px-1.5 py-1 md:px-2 md:py-1 border border-gray-600 tap-target"
                        title={provider.provider_name}
                      >
                        <img
                          src={getImageUrl(provider.logo_path, 'w45')}
                          alt={provider.provider_name}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-xs text-white hidden md:inline">{provider.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buy */}
              {buyServices.length > 0 && (
                <div className="mb-1.5">
                  <p className="text-xs text-gray-400 mb-1">Buy</p>
                  <div className="flex flex-wrap gap-1.5">
                    {buyServices.map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="flex items-center gap-1.5 bg-gray-800 rounded px-2 py-1 border border-gray-600"
                        title={provider.provider_name}
                      >
                        <img
                          src={getImageUrl(provider.logo_path, 'w45')}
                          alt={provider.provider_name}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-xs text-white">{provider.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rent */}
              {rentServices.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Rent</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rentServices.map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="flex items-center gap-1.5 bg-gray-800 rounded px-2 py-1 border border-gray-600"
                        title={provider.provider_name}
                      >
                        <img
                          src={getImageUrl(provider.logo_path, 'w45')}
                          alt={provider.provider_name}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-xs text-white">{provider.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowMetadata;
