import React, { useState } from 'react';
import type { RoadmapGoal, RoadmapItem } from '../types';
import { TimelineRow } from './TimelineRow';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';

interface TimelineGoalProps {
  goal: RoadmapGoal;
  year: number;
  colorClass: string;
  onItemClick: (item: RoadmapItem) => void;
}

export const TimelineGoal: React.FC<TimelineGoalProps> = ({ goal, year, colorClass, onItemClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-gray-800">
      {/* Goal Header */}
      <div
        className="flex items-center bg-gray-800/40 hover:bg-gray-800/60 cursor-pointer py-2 px-3 border-l-4 border-indigo-500 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mr-2 text-gray-400">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
        <Folder size={18} className="mr-2 text-indigo-400" />
        <span className="font-semibold text-gray-200 text-sm uppercase tracking-wider">
          {goal.name}
        </span>
        <span className="ml-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
          {goal.items.length} items
        </span>
      </div>

      {/* Goal Items */}
      {isExpanded && (
        <div className="bg-gray-900/10">
          {goal.items.map((item) => (
            <TimelineRow 
              key={item.id} 
              item={item} 
              year={year} 
              colorClass={colorClass}
              onClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
