import React, { useMemo } from 'react';
import type { RoadmapItem } from '../types';
import { clsx } from 'clsx';
import { differenceInDays, startOfYear, endOfYear, getYear } from 'date-fns';

interface TimelineRowProps {
  item: RoadmapItem;
  year: number;
  colorClass?: string;
  onClick: (item: RoadmapItem) => void;
}

export const TimelineRow: React.FC<TimelineRowProps> = ({ item, year, colorClass, onClick }) => {
  const { style, isVisible } = useMemo(() => {
    if (!item.start || !item.end) {
      return { style: {}, isVisible: false };
    }

    const start = new Date(item.start);
    const end = new Date(item.end);
    const yearStart = startOfYear(new Date(year, 0, 1));
    const yearEnd = endOfYear(new Date(year, 0, 1));
    const totalDays = differenceInDays(yearEnd, yearStart) + 1;

    // Clamp dates to the current year view
    if (getYear(start) > year || getYear(end) < year) {
       return { style: {}, isVisible: false };
    }

    const effectiveStart = start < yearStart ? yearStart : start;
    const effectiveEnd = end > yearEnd ? yearEnd : end;

    const startOffset = differenceInDays(effectiveStart, yearStart);
    const duration = differenceInDays(effectiveEnd, effectiveStart) + 1;

    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;

    return {
      style: {
        left: `${left}%`,
        width: `${width}%`,
      },
      isVisible: true
    };
  }, [item.start, item.end, year]);

  return (
    <div 
      className="flex border-b border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-100/30 dark:hover:bg-gray-800/30 transition-colors group"
      onClick={() => onClick(item)}
    >
      {/* Sidebar Info */}
      <div className="w-64 flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-center relative overflow-hidden transition-colors duration-300">
        <div className="font-medium text-gray-700 dark:text-gray-200 truncate" title={item.name}>
          {item.name}
        </div>
        {item.description && (
          <div className="text-xs text-gray-500 truncate" title={item.description}>
            {item.description}
          </div>
        )}
         {/* Status/Meta indicators could go here */}
         <div className="flex gap-2 mt-1 text-[10px] text-gray-600">
            {item.pd && <span>PD: {item.pd}</span>}
            {item.cost && <span>Cost: {item.cost}</span>}
         </div>
      </div>

      {/* Timeline Track */}
      <div className="flex-grow relative h-16 bg-gray-50/20 dark:bg-gray-900/20 transition-colors duration-300">
        {/* Grid Lines (Vertical) - 12 months */}
        <div className="absolute inset-0 flex pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => {
            const isQuarterEnd = (i + 1) % 3 === 0;
            return (
              <div 
                key={i} 
                className={clsx(
                  "flex-1 border-r last:border-r-0 transition-colors duration-300",
                  isQuarterEnd ? "border-gray-300/60 dark:border-gray-600/60" : "border-gray-200/30 dark:border-gray-800/30"
                )} 
              />
            );
          })}
        </div>

        {/* The Bar */}
        {isVisible && (
          <div
            className={clsx(
              "absolute top-1/2 -translate-y-1/2 h-8 rounded-md shadow-lg",
              colorClass || "from-blue-600 to-indigo-600 border-blue-500/30",
              "bg-gradient-to-r border",
              "hover:brightness-110 transition-all cursor-pointer",
              "flex items-center px-2 overflow-hidden"
            )}
            style={style}
            title={`${item.name} (${item.start?.toLocaleDateString()} - ${item.end?.toLocaleDateString()})`}
          >
            <span className="text-xs font-semibold text-white whitespace-nowrap truncate drop-shadow-md">
              {item.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
