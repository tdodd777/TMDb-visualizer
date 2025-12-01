import React, { useState, useEffect } from 'react';
import { getTrendingShows, getImageUrl } from '../../services/tmdb';
import { formatRating } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

const TrendingCarousel = () => {
  const [trendingShows, setTrendingShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectShow } = useApp();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true);
        const data = await getTrendingShows('week');
        setTrendingShows(data.results.slice(0, 12)); // Show top 12 trending
      } catch (err) {
        setError(err.message);
        console.error('Error fetching trending shows:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">🔥 Trending This Week</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32">
              <div className="animate-shimmer rounded-lg aspect-[2/3]" />
              <div className="animate-shimmer h-4 rounded mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Silently fail - don't show error on homepage
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
      <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
        <span>🔥</span>
        <span>Trending This Week</span>
      </h2>

      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-3 pt-2 scrollbar-hide">
          {trendingShows.map((show) => {
            const posterUrl = getImageUrl(show.poster_path, 'w342');
            const rating = formatRating(show.vote_average);

            return (
              <button
                key={show.id}
                onClick={() => selectShow(show)}
                className="flex-shrink-0 w-32 group cursor-pointer transition-all duration-200 ease-out hover:-translate-y-2 hover:drop-shadow-xl hover:scale-[1.03]"
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-[2/3] border-2 border-transparent group-hover:border-blue-500 transition-colors">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={show.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-700"
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

                  {/* Rating overlay */}
                  {show.vote_average > 0 && (
                    <div className="absolute top-1 right-1 bg-black/80 rounded px-1.5 py-0.5 flex items-center gap-0.5">
                      <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-semibold text-white">{rating}</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-left">
                  <p className="text-sm font-medium text-white line-clamp-2 h-10 group-hover:text-blue-400 transition-colors leading-tight">
                    {show.name}
                  </p>
                  {show.first_air_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(show.first_air_date).getFullYear()}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll hint */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-gradient-to-l from-gray-800 to-transparent w-12 h-full pointer-events-none" />
      </div>
    </div>
  );
};

export default TrendingCarousel;
