import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Skill } from '../../types';
import { SkillFormModal } from './SkillFormModal';
import { SkillDetailModal } from './SkillDetailModal';
import { LogSkillModal } from './LogSkillModal';
import { calculateSkillStats } from '../../utils/streak';
import { BookOpen, Plus, Search } from 'lucide-react';

export const SkillSection: React.FC = () => {
  const { data } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const [selectedSkillForDetail, setSelectedSkillForDetail] = useState<Skill | null>(null);
  const [selectedSkillForLog, setSelectedSkillForLog] = useState<Skill | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = Array.from(new Set(data.skills.map((s) => s.category).filter(Boolean)));

  const filteredSkills = data.skills.filter((s) => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = s.name?.toLowerCase().includes(q);
      const matchDesc = s.description?.toLowerCase().includes(q);
      const matchCat = s.category?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" /> Skills Learning Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track study sessions, log concepts learned, and measure mastery</p>
        </div>

        <button
          onClick={() => {
            setSkillToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search skills by name, description, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Learning">Learning</option>
            <option value="Completed">Completed</option>
            <option value="Paused">Paused</option>
            <option value="Not Started">Not Started</option>
          </select>

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
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-cyan-500/40" />
          <p className="text-sm">No skills added yet.</p>
          <button
            onClick={() => {
              setSkillToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl"
          >
            + Add Skill to Learn
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => {
            const stats = calculateSkillStats(skill);

            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkillForDetail(skill)}
                className="p-5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition space-y-4 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80">
                        {skill.status || 'Learning'}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition mt-1.5">
                        {skill.name || 'Untitled Skill'}
                      </h3>
                      {skill.category && <p className="text-xs text-slate-400 mt-0.5">{skill.category}</p>}
                    </div>

                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {skill.currentLevel}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Total Time: <strong className="font-mono text-cyan-300">{stats.totalHours}h {stats.totalMinutes}m</strong></span>
                      <span>Streak: <strong className="font-mono text-amber-400">🔥 {stats.currentStreak}d</strong></span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${stats.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Target: {skill.targetLevel}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSkillForLog(skill);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Log Study
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {isAddModalOpen && (
        <SkillFormModal
          skillToEdit={skillToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setSkillToEdit(null);
          }}
        />
      )}

      {/* Detail Modal */}
      {selectedSkillForDetail && (
        <SkillDetailModal
          skill={selectedSkillForDetail}
          onClose={() => setSelectedSkillForDetail(null)}
          onEdit={() => {
            setSkillToEdit(selectedSkillForDetail);
            setSelectedSkillForDetail(null);
            setIsAddModalOpen(true);
          }}
        />
      )}

      {/* Log Modal */}
      {selectedSkillForLog && (
        <LogSkillModal skill={selectedSkillForLog} onClose={() => setSelectedSkillForLog(null)} />
      )}
    </div>
  );
};
