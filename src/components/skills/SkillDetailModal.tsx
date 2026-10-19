import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Skill } from '../../types';
import { calculateSkillStats, formatDateDisplay } from '../../utils/streak';
import { LogSkillModal } from './LogSkillModal';
import {
  X,
  BookOpen,
  Plus,
  Edit2,
} from 'lucide-react';

interface SkillDetailModalProps {
  skill: Skill;
  onClose: () => void;
  onEdit: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, onClose, onEdit }) => {
  const { deleteSkill } = useApp();
  const [showLogModal, setShowLogModal] = useState(false);

  const stats = calculateSkillStats(skill);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                {skill.status || 'Learning'}
              </span>
              <span className="text-xs text-slate-400">Level: {skill.currentLevel} → {skill.targetLevel}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 mt-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" /> {skill.name || 'Untitled Skill'}
            </h2>
            {skill.description && <p className="text-xs text-slate-400 mt-1">{skill.description}</p>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLogModal(true)}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
            >
              <Plus className="w-4 h-4" /> Log Study
            </button>
            <button onClick={onEdit} className="p-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Learning Time</p>
              <p className="text-xl font-extrabold text-cyan-400 font-mono mt-0.5">
                {stats.totalHours}h {stats.totalMinutes}m
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">This Week / Month</p>
              <p className="text-sm font-bold text-slate-200 font-mono mt-0.5">
                {stats.hoursThisWeek}h week • {stats.hoursThisMonth}h month
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Learning Streak</p>
              <p className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
                🔥 {stats.currentStreak} days
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Average Daily Study</p>
              <p className="text-xl font-extrabold text-slate-100 font-mono mt-0.5">
                {stats.averageHoursPerDay} hrs/day
              </p>
            </div>
          </div>

          {/* Learning Resources */}
          {skill.learningResources && (
            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-slate-300 text-xs">Learning Resources</h4>
              <p className="text-xs text-slate-400 whitespace-pre-wrap">{skill.learningResources}</p>
            </div>
          )}

          {/* Daily Study History */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200">Study Session History</h3>
            {(skill.logs || []).length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No study logs recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
                {skill.logs?.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{formatDateDisplay(log.date)}</span>
                        {log.topicLearned && (
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-800">
                            {log.topicLearned}
                          </span>
                        )}
                      </div>
                      {log.notes && <p className="text-slate-400 mt-1">{log.notes}</p>}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-cyan-400 font-bold">
                        {log.hours || 0}h {log.minutes || 0}m
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
              if (confirm('Delete this skill permanently?')) {
                deleteSkill(skill.id);
                onClose();
              }
            }}
            className="px-3 py-2 bg-rose-950 text-rose-300 rounded-xl text-xs font-semibold border border-rose-800"
          >
            Delete Skill
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>

      {showLogModal && <LogSkillModal skill={skill} onClose={() => setShowLogModal(false)} />}
    </div>
  );
};
