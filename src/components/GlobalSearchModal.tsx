import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, CheckSquare, Briefcase, Target, BookOpen } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, data, setActiveSection } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Results
  const matchedTodos = q
    ? data.todos.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q))
      )
    : [];

  const matchedJobs = q
    ? data.jobApplications.filter(
        (j) =>
          j.companyName?.toLowerCase().includes(q) ||
          j.jobRole?.toLowerCase().includes(q) ||
          j.notes?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.status?.toLowerCase().includes(q)
      )
    : [];

  const matchedGoals = q
    ? data.goals.filter(
        (g) =>
          g.name?.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q) ||
          g.category?.toLowerCase().includes(q)
      )
    : [];

  const matchedSkills = q
    ? data.skills.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q) ||
          s.notes?.toLowerCase().includes(q)
      )
    : [];

  const totalResults = matchedTodos.length + matchedJobs.length + matchedGoals.length + matchedSkills.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search todos, job applications, goals, skills, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs text-slate-400 bg-slate-800 rounded hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1">
          {!q && (
            <div className="text-center py-12 text-slate-500">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Type to search across your productivity workspace</p>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p>No results found matching "{query}"</p>
            </div>
          )}

          {matchedTodos.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" /> Todos ({matchedTodos.length})
              </h3>
              <div className="space-y-2">
                {matchedTodos.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveSection('todos');
                      setIsSearchOpen(false);
                    }}
                    className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl cursor-pointer transition border border-slate-700/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-200">{t.title || 'Untitled Todo'}</p>
                      {t.description && <p className="text-xs text-slate-400 line-clamp-1">{t.description}</p>}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedJobs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Job Applications ({matchedJobs.length})
              </h3>
              <div className="space-y-2">
                {matchedJobs.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => {
                      setActiveSection('jobs');
                      setIsSearchOpen(false);
                    }}
                    className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl cursor-pointer transition border border-slate-700/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-200">
                        {j.companyName || 'Company'} - <span className="text-indigo-400">{j.jobRole || 'Role'}</span>
                      </p>
                      {j.location && <p className="text-xs text-slate-400">{j.location} • {j.workMode}</p>}
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {j.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedGoals.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" /> Goals & Consistency ({matchedGoals.length})
              </h3>
              <div className="space-y-2">
                {matchedGoals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      setActiveSection('goals');
                      setIsSearchOpen(false);
                    }}
                    className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl cursor-pointer transition border border-slate-700/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-200">{g.name || 'Untitled Goal'}</p>
                      {g.description && <p className="text-xs text-slate-400 line-clamp-1">{g.description}</p>}
                    </div>
                    <span className="text-xs text-amber-400 font-mono">
                      Target: {g.targetValue || 1} {g.unit || 'times'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedSkills.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Skills ({matchedSkills.length})
              </h3>
              <div className="space-y-2">
                {matchedSkills.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSection('skills');
                      setIsSearchOpen(false);
                    }}
                    className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl cursor-pointer transition border border-slate-700/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-200">{s.name || 'Untitled Skill'}</p>
                      {s.notes && <p className="text-xs text-slate-400 line-clamp-1">{s.notes}</p>}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {s.currentLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
