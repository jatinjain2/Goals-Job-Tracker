import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Goal } from '../../types';
import { calculateGoalStats, formatDateDisplay } from '../../utils/streak';
import { ConsistencyHeatmap } from './ConsistencyHeatmap';
import { LogProgressModal } from './LogProgressModal';
import {
  X,
  Target,
  Plus,
  Edit2,
} from 'lucide-react';

interface GoalDetailModalProps {
  goal: Goal;
  onClose: () => void;
  onEdit: () => void;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({ goal, onClose, onEdit }) => {
  const { deleteGoal } = useApp();
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedDateForLog, setSelectedDateForLog] = useState<string | undefined>(undefined);

  const stats = calculateGoalStats(goal);
  const logsList = Object.keys(goal.logs || {})
    .sort()
    .reverse()
    .map((dateStr) => goal.logs![dateStr]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                {goal.frequency || 'Daily'} Goal
              </span>
              {goal.category && <span className="text-xs text-slate-400">• {goal.category}</span>}
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 mt-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> {goal.name || 'Untitled Goal'}
            </h2>
            {goal.description && <p className="text-xs text-slate-400 mt-1">{goal.description}</p>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedDateForLog(undefined);
                setShowLogModal(true);
              }}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-amber-600/20"
            >
              <Plus className="w-4 h-4" /> Log Progress
            </button>
            <button onClick={onEdit} className="p-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Current Streak</p>
              <p className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
                🔥 {stats.currentStreak} days
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Longest Streak</p>
              <p className="text-xl font-extrabold text-orange-400 font-mono mt-0.5">
                🏆 {stats.longestStreak} days
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Completion Rate</p>
              <p className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
                {stats.completionPercentage}%
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Achieved</p>
              <p className="text-xl font-extrabold text-slate-100 font-mono mt-0.5">
                {stats.totalAchieved} {goal.unit || ''}
              </p>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800">
            <ConsistencyHeatmap
              logs={goal.logs}
              targetValue={goal.targetValue || 1}
              onSelectDate={(dStr) => {
                setSelectedDateForLog(dStr);
                setShowLogModal(true);
              }}
            />
          </div>

          {/* History Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200">Daily Log History</h3>
            {logsList.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No progress logs recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
                {logsList.map((log) => (
                  <div
                    key={log.date}
                    onClick={() => {
                      setSelectedDateForLog(log.date);
                      setShowLogModal(true);
                    }}
                    className="p-3 bg-slate-800/40 hover:bg-slate-800 rounded-xl border border-slate-800 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{formatDateDisplay(log.date)}</div>
                      {log.notes && <p className="text-slate-400 mt-0.5">{log.notes}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-amber-400 font-bold">
                        {log.actualValue ?? (log.completed ? goal.targetValue || 1 : 0)} / {goal.targetValue || 1} {goal.unit || ''}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          log.completed ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                        }`}
                      >
                        {log.completed ? 'Completed' : 'Missed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between sticky bottom-0 bg-slate-900">
          <button
            onClick={() => {
              if (confirm('Delete this goal permanently?')) {
                deleteGoal(goal.id);
                onClose();
              }
            }}
            className="px-3 py-2 bg-rose-950 text-rose-300 rounded-xl text-xs font-semibold border border-rose-800"
          >
            Delete Goal
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>

      {showLogModal && (
        <LogProgressModal
          goal={goal}
          initialDateStr={selectedDateForLog}
          onClose={() => setShowLogModal(false)}
        />
      )}
    </div>
  );
};
