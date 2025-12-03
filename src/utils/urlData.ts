import LZString from 'lz-string';
import type { RoadmapData, RoadmapItem } from '../types';

// Minified types to save space
interface MinifiedItem {
  i: string; // id
  n: string; // name
  d?: string; // description
  a?: string; // acceptanceCriteria
  s?: string; // start (ISO string)
  e?: string; // end (ISO string)
  p?: string; // pd
  c?: string; // cost
  g?: string; // goalId
}

interface MinifiedGoal {
  i: string; // id
  n: string; // name
  it: MinifiedItem[]; // items
}

interface MinifiedData {
  gs: MinifiedGoal[]; // goals
  ui: MinifiedItem[]; // ungroupedItems
}

function minifyItem(item: RoadmapItem): MinifiedItem {
  return {
    i: item.id,
    n: item.name,
    d: item.description,
    a: item.acceptanceCriteria,
    s: item.start?.toISOString(),
    e: item.end?.toISOString(),
    p: item.pd,
    c: item.cost,
    g: item.goalId,
  };
}

function unminifyItem(item: MinifiedItem): RoadmapItem {
  return {
    id: item.i,
    name: item.n,
    description: item.d,
    acceptanceCriteria: item.a,
    start: item.s ? new Date(item.s) : undefined,
    end: item.e ? new Date(item.e) : undefined,
    pd: item.p,
    cost: item.c,
    goalId: item.g,
  };
}

export function minifyData(data: RoadmapData): MinifiedData {
  return {
    gs: data.goals.map(g => ({
      i: g.id,
      n: g.name,
      it: g.items.map(minifyItem),
    })),
    ui: data.ungroupedItems.map(minifyItem),
  };
}

export function unminifyData(data: MinifiedData): RoadmapData {
  return {
    goals: data.gs.map(g => ({
      id: g.i,
      name: g.n,
      items: g.it.map(unminifyItem),
    })),
    ungroupedItems: data.ui.map(unminifyItem),
  };
}

export function generateShareUrl(data: RoadmapData): string {
  const minified = minifyData(data);
  const jsonString = JSON.stringify(minified);
  const compressed = LZString.compressToEncodedURIComponent(jsonString);
  
  const url = new URL(window.location.href);
  // Remove query param if it exists (cleanup)
  url.searchParams.delete('data');
  // Set hash
  url.hash = `data=${compressed}`;
  
  return url.toString();
}

export function parseShareUrl(): RoadmapData | null {
  // Check hash first
  let compressedData = '';
  const hash = window.location.hash;
  if (hash.startsWith('#data=')) {
    compressedData = hash.substring(6); // remove #data=
  } 
  // Fallback to query param for backward compatibility
  else {
    const params = new URLSearchParams(window.location.search);
    const queryData = params.get('data');
    if (queryData) compressedData = queryData;
  }

  if (!compressedData) return null;

  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);

    // Check if it's minified (has 'gs' or 'ui' keys) or legacy full format
    if ('gs' in parsed || 'ui' in parsed) {
      return unminifyData(parsed as MinifiedData);
    } else {
      // Legacy format - just need to revive dates
      const reviveItemDates = (item: any) => {
        if (item.start) item.start = new Date(item.start);
        if (item.end) item.end = new Date(item.end);
        return item;
      };

      if (parsed.goals) {
        parsed.goals.forEach((g: any) => {
          g.items = g.items.map(reviveItemDates);
        });
      }
      if (parsed.ungroupedItems) {
        parsed.ungroupedItems = parsed.ungroupedItems.map(reviveItemDates);
      }
      return parsed as RoadmapData;
    }
  } catch (error) {
    console.error('Failed to parse share URL:', error);
    return null;
  }
}
