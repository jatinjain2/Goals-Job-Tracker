import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Goal } from '../../types';
import { X } from 'lucide-react';
import { getTodayStr } from '../../utils/streak';

interface LogProgressModalProps {
  goal: Goal;
  initialDateStr?: string;
  onClose: () => void;
}

export const LogProgressModal: React.FC<LogProgressModalProps> = ({
  goal,
  initialDateStr = getTodayStr(),
  onClose,
}) => {
  const { logGoalProgress } = useApp();

  const existingLog = goal.logs ? goal.logs[initialDateStr] : undefined;

  const [dateStr, setDateStr] = useState(initialDateStr);
  const [completed, setCompleted] = useState(existingLog ? existingLog.completed ?? true : true);
  const [actualValue, setActualValue] = useState<number | ''>(
    existingLog?.actualValue ?? goal.targetValue ?? 1
  );
  const [timeSpentMinutes, setTimeSpentMinutes] = useState<number | ''>(existingLog?.timeSpentMinutes ?? '');
  const [startTime, setStartTime] = useState(existingLog?.startTime ?? '');
  const [endTime, setEndTime] = useState(existingLog?.endTime ?? '');
  const [notes, setNotes] = useState(existingLog?.notes ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logGoalProgress(goal.id, dateStr, {
      date: dateStr,
      completed,
      actualValue: typeof actualValue === 'number' ? actualValue : undefined,
      timeSpentMinutes: typeof timeSpentMinutes === 'number' ? timeSpentMinutes : undefined,
      startTime,
      endTime,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100">Log Progress</h2>
            <p className="text-xs text-amber-400 font-semibold">{goal.name || 'Goal'}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Log Date</label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <span className="font-semibold text-slate-200">Goal Completed for Date?</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
              />
              <span className={completed ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {completed ? 'Yes ✓' : 'No'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">
                Achieved Value ({goal.unit || 'units'})
              </label>
              <input
                type="number"
                step="any"
                placeholder={`Target: ${goal.targetValue || 1}`}
                value={actualValue}
                onChange={(e) => setActualValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Time Spent (Minutes)</label>
              <input
                type="number"
                placeholder="e.g. 60"
                value={timeSpentMinutes}
                onChange={(e) => setTimeSpentMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Start Time (Optional)</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">End Time (Optional)</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Notes / Reflection (Optional)</label>
            <textarea
              rows={2}
              placeholder="What did you accomplish or learn?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2 text-slate-100 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-600/20"
            >
              Save Daily Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
