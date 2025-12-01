import React from 'react';
import { getColorScaleLegend } from '../../utils/colorScale';

const HeatmapLegend = () => {
  const legend = getColorScaleLegend();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 mb-3">
      <h3 className="text-sm font-semibold text-white mb-2">Rating Scale</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1.5">
        {legend.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div className={`${item.color} w-5 h-5 rounded flex-shrink-0`} />
            <div className="flex-grow min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {item.label}
              </p>
              <p className="text-xs text-gray-400">{item.range}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2 italic">
        Hover over episodes for details • Click to view full information
      </p>
    </div>
  );
};

export default HeatmapLegend;
