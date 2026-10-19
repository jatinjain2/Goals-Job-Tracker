import React from 'react';
import type { DailyGoalLog } from '../../types';

interface ConsistencyHeatmapProps {
  logs?: Record<string, DailyGoalLog>;
  targetValue?: number;
  onSelectDate?: (dateStr: string) => void;
}

export const ConsistencyHeatmap: React.FC<ConsistencyHeatmapProps> = ({
  logs = {},
  targetValue = 1,
  onSelectDate,
}) => {
  // Generate last 90 days grid
  const days: { dateStr: string; log?: DailyGoalLog; intensity: number }[] = [];
  const today = new Date();

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const log = logs[dateStr];
    let intensity = 0; // 0 = empty, 1 = low, 2 = mid, 3 = high, 4 = full

    if (log) {
      if (log.completed) {
        intensity = 4;
      } else if (log.actualValue && log.actualValue > 0) {
        const ratio = log.actualValue / targetValue;
        if (ratio >= 1) intensity = 4;
        else if (ratio >= 0.75) intensity = 3;
        else if (ratio >= 0.4) intensity = 2;
        else intensity = 1;
      }
    }

    days.push({ dateStr, log, intensity });
  }

  const getBgClass = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-emerald-500 hover:bg-emerald-400 border-emerald-400/50';
      case 3:
        return 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50';
      case 2:
        return 'bg-emerald-700/80 hover:bg-emerald-600 border-emerald-600/50';
      case 1:
        return 'bg-emerald-900/60 hover:bg-emerald-800 border-emerald-800/50';
      default:
        return 'bg-slate-800/60 hover:bg-slate-700 border-slate-700/40';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Last 90 Days Consistency Heatmap</span>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-slate-800 border border-slate-700" />
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-900/60" />
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-700/80" />
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
          <span>More</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto p-2 bg-slate-950/40 border border-slate-800/60 rounded-xl">
        {days.map((item) => (
          <button
            key={item.dateStr}
            onClick={() => onSelectDate && onSelectDate(item.dateStr)}
            title={`${item.dateStr}: ${
              item.log ? (item.log.completed ? 'Completed' : `${item.log.actualValue || 0} / ${targetValue}`) : 'No entry'
            }`}
            className={`w-3.5 h-3.5 rounded-xs border transition-all heatmap-cell ${getBgClass(item.intensity)}`}
          />
        ))}
      </div>
    </div>
  );
};
