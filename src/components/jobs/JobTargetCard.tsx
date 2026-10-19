import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Edit2, Check, X } from 'lucide-react';
import { getTodayStr } from '../../utils/streak';

export const JobTargetCard: React.FC = () => {
  const { data, updateJobTargets } = useApp();
  const todayStr = getTodayStr();

  const [isEditing, setIsEditing] = useState(false);
  const [daily, setDaily] = useState(data.jobTargets.dailyTarget || 5);
  const [monthly, setMonthly] = useState(data.jobTargets.monthlyTarget || 100);

  // Today's applications
  const jobsTodayCount = data.jobApplications.filter((j) => j.dateApplied === todayStr).length;

  // Monthly applications
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const jobsMonthCount = data.jobApplications.filter((j) => {
    if (!j.dateApplied) return false;
    const d = new Date(j.dateApplied);
    return !isNaN(d.getTime()) && d >= startOfMonth;
  }).length;

  const dailyRemaining = Math.max(0, (data.jobTargets.dailyTarget || 5) - jobsTodayCount);
  const dailyPercent = Math.min(100, Math.round((jobsTodayCount / (data.jobTargets.dailyTarget || 5)) * 100));

  const monthlyRemaining = Math.max(0, (data.jobTargets.monthlyTarget || 100) - jobsMonthCount);
  const monthlyPercent = Math.min(
    100,
    Math.round((jobsMonthCount / (data.jobTargets.monthlyTarget || 100)) * 100)
  );

  const handleSave = () => {
    updateJobTargets({ dailyTarget: Number(daily) || 1, monthlyTarget: Number(monthly) || 1 });
    setIsEditing(false);
  };

  return (
    <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-800/40 p-5 rounded-2xl relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" /> Application Goals & Targets
        </h3>

        {isEditing ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center gap-1 px-2"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 rounded bg-slate-800 text-slate-300 text-xs px-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
          >
            <Edit2 className="w-3.5 h-3.5" /> Change Targets
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Daily Target (Apps/Day)</label>
            <input
              type="number"
              min="1"
              value={daily}
              onChange={(e) => setDaily(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Target (Apps/Month)</label>
            <input
              type="number"
              min="1"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Target Progress */}
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-semibold text-slate-300">Daily Target</span>
              <span className="text-xs font-mono font-bold text-purple-400">{dailyPercent}%</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-extrabold text-slate-100 font-mono">{jobsTodayCount}</span>
              <span className="text-xs text-slate-400">/ {data.jobTargets.dailyTarget || 5} applied today</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {dailyRemaining > 0 ? `${dailyRemaining} remaining for today` : '🎉 Daily target completed!'}
            </p>
          </div>

          {/* Monthly Target Progress */}
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-semibold text-slate-300">Monthly Target</span>
              <span className="text-xs font-mono font-bold text-indigo-400">{monthlyPercent}%</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-extrabold text-slate-100 font-mono">{jobsMonthCount}</span>
              <span className="text-xs text-slate-400">/ {data.jobTargets.monthlyTarget || 100} applied this month</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${monthlyPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {monthlyRemaining > 0 ? `${monthlyRemaining} remaining this month` : '🎉 Monthly target achieved!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
