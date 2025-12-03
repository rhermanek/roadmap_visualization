import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import type { RoadmapData } from '../types';
import { generateShareUrl } from '../utils/urlData';

interface ShareButtonProps {
  data: RoadmapData;
}

export function ShareButton({ data }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleShare = async () => {
    setGenerating(true);
    try {
      const url = generateShareUrl(data);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to generate share link:', error);
      alert('Failed to generate share link. The data might be too large.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed rounded-lg transition-colors"
      title="Share Roadmap URL"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? 'Copied!' : generating ? 'Generating...' : 'Share'}
    </button>
  );
}
