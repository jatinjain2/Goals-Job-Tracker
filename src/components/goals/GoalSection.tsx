import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Goal } from '../../types';
import { GoalFormModal } from './GoalFormModal';
import { GoalDetailModal } from './GoalDetailModal';
import { LogProgressModal } from './LogProgressModal';
import { ConsistencyHeatmap } from './ConsistencyHeatmap';
import { calculateGoalStats } from '../../utils/streak';
import { Target, Plus, Search, CheckCircle2 } from 'lucide-react';

export const GoalSection: React.FC = () => {
  const { data } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);
  const [selectedGoalForDetail, setSelectedGoalForDetail] = useState<Goal | null>(null);
  const [selectedGoalForLog, setSelectedGoalForLog] = useState<Goal | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');

  const categories = Array.from(new Set(data.goals.map((g) => g.category).filter(Boolean)));

  const filteredGoals = data.goals.filter((g) => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = g.name?.toLowerCase().includes(q);
      const matchDesc = g.description?.toLowerCase().includes(q);
      const matchCat = g.category?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    if (categoryFilter !== 'all' && g.category !== categoryFilter) return false;
    if (frequencyFilter !== 'all' && g.frequency !== frequencyFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-400" /> Goals & Consistency Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">Build daily habits, track flexible goals, and maintain streaks</p>
        </div>

        <button
          onClick={() => {
            setGoalToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Goal
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search goals by name, description, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Frequencies</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Target className="w-12 h-12 mx-auto text-amber-500/40" />
          <p className="text-sm">No goals set up yet.</p>
          <button
            onClick={() => {
              setGoalToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl"
          >
            + Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const stats = calculateGoalStats(goal);
            const isLoggedToday = !!stats.todayLog && (stats.todayLog.completed || (stats.todayLog.actualValue ?? 0) >= (goal.targetValue || 1));

            return (
              <div
                key={goal.id}
                onClick={() => setSelectedGoalForDetail(goal)}
                className="p-5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition space-y-4 group flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/80">
                        {goal.frequency || 'Daily'} Goal
                      </span>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition mt-1.5">
                        {goal.name || 'Untitled Goal'}
                      </h3>
                      {goal.description && <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{goal.description}</p>}
                    </div>

                    {/* Streak Badge */}
                    <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 shrink-0 text-right">
                      <p className="text-[10px] font-semibold text-slate-400">Current Streak</p>
                      <p className="text-sm font-extrabold text-amber-400 font-mono">
                        🔥 {stats.currentStreak} d
                      </p>
                    </div>
                  </div>

                  {/* Target info */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                    <span>Target: <strong className="font-mono text-amber-300">{goal.targetValue || 1} {goal.unit || 'units'}</strong></span>
                    <span>Completion: <strong className="font-mono text-emerald-400">{stats.completionPercentage}%</strong></span>
                  </div>

                  {/* Heatmap Preview */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <ConsistencyHeatmap logs={goal.logs} targetValue={goal.targetValue || 1} />
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Best Streak: <strong className="text-slate-200">{stats.longestStreak} days</strong>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGoalForLog(goal);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      isLoggedToday
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20'
                    }`}
                  >
                    {isLoggedToday ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done Today
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Log Today
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {isAddModalOpen && (
        <GoalFormModal
          goalToEdit={goalToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setGoalToEdit(null);
          }}
        />
      )}

      {/* Detail Modal */}
      {selectedGoalForDetail && (
        <GoalDetailModal
          goal={selectedGoalForDetail}
          onClose={() => setSelectedGoalForDetail(null)}
          onEdit={() => {
            setGoalToEdit(selectedGoalForDetail);
            setSelectedGoalForDetail(null);
            setIsAddModalOpen(true);
          }}
        />
      )}

      {/* Log Modal */}
      {selectedGoalForLog && (
        <LogProgressModal
          goal={selectedGoalForLog}
          onClose={() => setSelectedGoalForLog(null)}
        />
      )}
    </div>
  );
};
