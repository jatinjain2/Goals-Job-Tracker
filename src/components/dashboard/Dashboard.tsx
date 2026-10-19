import React from 'react';
import { useApp } from '../../context/AppContext';
import { TodayOverview } from './TodayOverview';
import { OverallStats } from './OverallStats';
import { DashboardCharts } from './DashboardCharts';
import { Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { openModal } = useApp();

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Personal Productivity Hub
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Track your tasks, job search pipeline, daily consistency habits, and skill learning in one single offline workspace.
          </p>
        </div>

        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10 shrink-0">
          <button
            onClick={() => openModal('todo')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Todo
          </button>
          <button
            onClick={() => openModal('job')}
            className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Job
          </button>
          <button
            onClick={() => openModal('goal')}
            className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Goal
          </button>
          <button
            onClick={() => openModal('skill')}
            className="px-3.5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </div>
      </div>

      {/* Today Overview */}
      <TodayOverview />

      {/* Overall Stats */}
      <OverallStats />

      {/* Dynamic Charts */}
      <DashboardCharts />
    </div>
  );
};
