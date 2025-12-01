import React from 'react';

const HeatmapSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: '32px repeat(10, minmax(24px, 36px))' }}
        >
          {/* Header row */}
          <div className="h-5 bg-gray-800" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-5 animate-shimmer rounded" />
          ))}

          {/* 3 skeleton rows */}
          {Array.from({ length: 3 }).map((_, rowIdx) => (
            <React.Fragment key={rowIdx}>
              <div className="h-8 bg-gray-800 flex items-center justify-center">
                <div className="w-8 h-4 animate-shimmer rounded" />
              </div>
              {Array.from({ length: 10 }).map((_, colIdx) => (
                <div key={colIdx} className="h-8 animate-shimmer rounded" />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatmapSkeleton;
