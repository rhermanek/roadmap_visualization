export const GOAL_COLORS = [
  'from-blue-600 to-indigo-600 border-blue-500/30',
  'from-emerald-600 to-teal-600 border-emerald-500/30',
  'from-purple-600 to-fuchsia-600 border-purple-500/30',
  'from-amber-600 to-orange-600 border-amber-500/30',
  'from-rose-600 to-pink-600 border-rose-500/30',
  'from-cyan-600 to-sky-600 border-cyan-500/30',
  'from-lime-600 to-green-600 border-lime-500/30',
  'from-violet-600 to-purple-600 border-violet-500/30',
];

export const DEFAULT_COLOR = 'from-gray-600 to-slate-600 border-gray-500/30';

export const getGoalColor = (index: number) => GOAL_COLORS[index % GOAL_COLORS.length];
