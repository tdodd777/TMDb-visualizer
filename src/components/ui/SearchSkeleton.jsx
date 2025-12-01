import React from 'react';

const SearchSkeleton = () => {
  return (
    <div className="mt-6">
      <div className="h-4 w-32 animate-shimmer rounded mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
          >
            <div className="aspect-[2/3] animate-shimmer" />
            <div className="p-3">
              <div className="h-5 animate-shimmer rounded mb-2" />
              <div className="h-4 w-16 animate-shimmer rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSkeleton;
