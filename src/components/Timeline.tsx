import React from 'react';
import type { RoadmapData } from '../types';
import { TimelineHeader } from './TimelineHeader';
import { TimelineGoal } from './TimelineGoal';
import { TimelineRow } from './TimelineRow';
import { getGoalColor } from '../utils/colors';

interface TimelineProps {
  data: RoadmapData;
  year?: number;
}

export const Timeline: React.FC<TimelineProps> = ({ data, year = new Date().getFullYear() }) => {
  return (
    <div className="flex flex-col w-full h-full bg-[#1a1a1a] text-gray-200 overflow-hidden rounded-xl border border-gray-800 shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Project Roadmap <span className="text-blue-500">{year}</span>
        </h2>
        <div className="text-sm text-gray-500">
          {data.goals.length} Goals • {data.ungroupedItems.length + data.goals.reduce((acc, g) => acc + g.items.length, 0)} Items
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-auto custom-scrollbar">
        <div className="min-w-[1000px] relative">
          <TimelineHeader />
          
          <div className="relative">
            {/* Goals */}
            {data.goals.map((goal, index) => (
              <TimelineGoal 
                key={goal.id} 
                goal={goal} 
                year={year} 
                colorClass={getGoalColor(index)}
              />
            ))}

            {/* Ungrouped Items */}
            {data.ungroupedItems.length > 0 && (
              <>
                {data.goals.length > 0 && (
                  <div className="px-3 py-2 bg-gray-800/30 text-xs font-bold text-gray-500 uppercase tracking-wider border-y border-gray-800 mt-4">
                    Other Items
                  </div>
                )}
                {data.ungroupedItems.map((item, index) => (
                  <TimelineRow 
                    key={item.id} 
                    item={item} 
                    year={year} 
                    colorClass={getGoalColor(index + data.goals.length)} // Offset by goals length to maintain variety
                  />
                ))}
              </>
            )}
            
            {/* Empty State */}
            {data.goals.length === 0 && data.ungroupedItems.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No items found in this roadmap.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
