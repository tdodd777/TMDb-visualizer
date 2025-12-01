import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import EpisodeCell from './EpisodeCell';
import HeatmapSkeleton from '../ui/HeatmapSkeleton';

const HeatmapGrid = () => {
  const { heatmapData, selectEpisode } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (heatmapData?.seasons?.length > 0) {
      setIsLoaded(false);
      const timer = setTimeout(() => setIsLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [heatmapData]);

  if (!heatmapData || !heatmapData.seasons || heatmapData.seasons.length === 0) {
    return <HeatmapSkeleton />;
  }

  const { seasons, maxEpisodes } = heatmapData;

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `32px repeat(${maxEpisodes}, minmax(24px, 36px))`,
          }}
        >
          {/* Header row - Episode numbers */}
          <div className="sticky left-0 bg-gray-800 z-10 h-5" /> {/* Empty corner cell */}
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
            <React.Fragment key={season.seasonNumber}>
              {/* Season label */}
              <div className="sticky left-0 bg-gray-800 z-10 flex items-center justify-center h-8">
                <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
                  S{String(season.seasonNumber).padStart(2, '0')}
                </span>
              </div>

              {/* Episode cells */}
              {Array.from({ length: maxEpisodes }, (_, episodeIndex) => {
                const episode = season.episodes[episodeIndex];
                return (
                  <div
                    key={`s${season.seasonNumber}-e${episodeIndex + 1}`}
                    className="h-8"
                  >
                    <EpisodeCell
                      episode={episode}
                      seasonNumber={season.seasonNumber}
                      onClick={selectEpisode}
                      rowIndex={rowIndex}
                      colIndex={episodeIndex}
                      isLoaded={isLoaded}
                    />
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
