import React from 'react';
import { clsx } from 'clsx';

export const TimelineHeader: React.FC = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const quarters = [
    { name: 'Q1', span: 3 },
    { name: 'Q2', span: 3 },
    { name: 'Q3', span: 3 },
    { name: 'Q4', span: 3 },
  ];

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-[#242424] border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-md transition-colors duration-300">
      {/* Quarters Row */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <div className="w-64 flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">
          {/* Spacer for Item Details */}
          Roadmap Items
        </div>
        <div className="flex-grow flex">
          {quarters.map((q, i) => (
            <div
              key={q.name}
              className={clsx(
                "flex-1 text-center py-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 font-bold text-gray-700 dark:text-gray-200 transition-colors duration-300",
                i % 2 === 0 ? "bg-gray-100/60 dark:bg-gray-800/60" : "bg-gray-50/40 dark:bg-gray-800/40" // Alternating backgrounds
              )}
            >
              {q.name}
            </div>
          ))}
        </div>
      </div>

      {/* Months Row */}
      <div className="flex">
        <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 transition-colors duration-300">
          {/* Spacer */}
        </div>
        <div className="flex-grow flex">
          {months.map((m) => (
            <div
              key={m}
              className="flex-1 text-center py-2 border-r border-gray-200 dark:border-gray-800 last:border-r-0 text-sm text-gray-500 transition-colors duration-300"
            >
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
