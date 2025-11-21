import React from 'react';
import { X, Calendar, DollarSign, FileText, CheckSquare } from 'lucide-react';
import type { RoadmapItem } from '../types';

interface ItemDetailsModalProps {
  item: RoadmapItem;
  onClose: () => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-start bg-gray-800/50">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{item.name}</h2>
            <div className="text-sm text-gray-400 font-mono">{item.id}</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {/* Meta Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.start && item.end && (
              <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Calendar size={18} />
                  <span className="font-semibold text-sm uppercase">Timeline</span>
                </div>
                <div className="text-gray-200">
                  {item.start.toLocaleDateString()} - {item.end.toLocaleDateString()}
                </div>
              </div>
            )}
            
            {(item.cost || item.pd) && (
              <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <DollarSign size={18} />
                  <span className="font-semibold text-sm uppercase">Resources</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 text-xs block">Cost</span>
                    <span className="text-gray-200">{item.cost || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">PD</span>
                    <span className="text-gray-200">{item.pd || '-'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <FileText size={20} />
              <h3 className="font-semibold text-lg">Description</h3>
            </div>
            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 text-gray-300 leading-relaxed whitespace-pre-wrap">
              {item.description || "No description provided."}
            </div>
          </div>

          {/* Acceptance Criteria */}
          {item.acceptanceCriteria && (
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-3">
                <CheckSquare size={20} />
                <h3 className="font-semibold text-lg">Acceptance Criteria</h3>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 text-gray-300 leading-relaxed whitespace-pre-wrap">
                {item.acceptanceCriteria}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
