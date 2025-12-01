import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import EpisodeCell from './EpisodeCell';
import HeatmapSkeleton from '../ui/HeatmapSkeleton';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const HeatmapGrid = () => {
  const { heatmapData, selectEpisode } = useApp();
  const [animationKey, setAnimationKey] = useState(0);

  // Use Intersection Observer to detect when heatmap enters viewport
  // Triggers animation when 20% of heatmap is visible
  const { ref: heatmapRef, isVisible } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before fully visible
    triggerOnce: true, // Only animate once per show
  });

  // Force re-render when heatmap data changes to reset animation
  useEffect(() => {
    if (heatmapData?.seasons?.length > 0) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [heatmapData]);

  if (!heatmapData || !heatmapData.seasons || heatmapData.seasons.length === 0) {
    return <HeatmapSkeleton />;
  }

  const { seasons, maxEpisodes } = heatmapData;

  return (
    <div ref={heatmapRef} className="overflow-x-auto ios-smooth-scroll">
      <div className="inline-block min-w-full">
        <div
          key={animationKey}
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `32px repeat(${maxEpisodes}, minmax(24px, 36px))`,
          }}
        >
          {/* Header row - Episode numbers */}
          <div className="sticky left-0 bg-gray-800 z-10 h-5" />
          {Array.from({ length: maxEpisodes }, (_, i) => (
            <div
              key={`ep-${i + 1}`}
              className="text-center text-xs font-semibold text-gray-400 pb-0.5 h-5 flex items-center justify-center"
            >
              {i + 1}
            </div>
          ))}

          {/* Season rows */}
          {seasons.map((season, rowIndex) => (
            <React.Fragment key={`${season.seasonNumber}-${animationKey}`}>
              {/* Season label */}
              <div className="sticky left-0 bg-gray-800 z-10 flex items-center justify-center h-8">
                <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
                  S{String(season.seasonNumber).padStart(2, '0')}
                </span>
              </div>

              {/* Episode cells */}
              {Array.from({ length: maxEpisodes }, (_, episodeIndex) => {
                const episode = season.episodes[episodeIndex];
                const delay = (rowIndex * 30) + (episodeIndex * 15);

                return (
                  <div
                    key={`s${season.seasonNumber}-e${episodeIndex + 1}-${animationKey}`}
                    className="h-8"
                  >
                    {episode ? (
                      <div
                        className={`w-full h-full animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
                        style={{
                          animationDelay: isVisible ? `${delay}ms` : '0ms',
                        }}
                      >
                        <EpisodeCell
                          episode={episode}
                          seasonNumber={season.seasonNumber}
                          onClick={selectEpisode}
                          rowIndex={rowIndex}
                          colIndex={episodeIndex}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-800/30" />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatmapGrid;
