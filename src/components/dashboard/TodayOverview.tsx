import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Circle, Briefcase, Target, BookOpen, ArrowRight } from 'lucide-react';
import { getTodayStr, calculateGoalStats } from '../../utils/streak';

export const TodayOverview: React.FC = () => {
  const { data, setActiveSection, toggleTodoComplete, openModal } = useApp();
  const todayStr = getTodayStr();

  // Todos today or pending
  const todayTodos = data.todos.filter(
    (t) => t.dueDate === todayStr || (!t.dueDate && t.status !== 'Completed')
  );
  const pendingTodayTodos = todayTodos.filter((t) => t.status !== 'Completed');
  const completedTodayTodos = todayTodos.filter((t) => t.status === 'Completed');

  // Jobs applied today
  const jobsAppliedToday = data.jobApplications.filter((j) => j.dateApplied === todayStr);
  const dailyJobTarget = data.jobTargets.dailyTarget || 5;
  const jobTargetPercent = Math.min(100, Math.round((jobsAppliedToday.length / dailyJobTarget) * 100));

  // Active consistency goals & progress today
  const goalsWithStats = data.goals.map((g) => {
    const stats = calculateGoalStats(g);
    const hasLogToday = !!stats.todayLog && (stats.todayLog.completed || (stats.todayLog.actualValue ?? 0) >= (g.targetValue || 1));
    return { goal: g, stats, hasLogToday };
  });

  const goalsLoggedTodayCount = goalsWithStats.filter((g) => g.hasLogToday).length;
  const totalGoals = data.goals.length;
  const goalConsistencyPercent = totalGoals > 0 ? Math.round((goalsLoggedTodayCount / totalGoals) * 100) : 0;

  // Skills being learned
  const learningSkills = data.skills.filter((s) => s.status === 'Learning');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>Today's Overview</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time breakdown of your daily commitments and metrics</p>
        </div>
      </div>

      {/* Grid of Focus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Job Target */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Target</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100 font-mono">{jobsAppliedToday.length}</span>
            <span className="text-xs text-slate-400">/ {dailyJobTarget} applications</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Target Progress</span>
              <span className="font-mono text-purple-400 font-semibold">{jobTargetPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${jobTargetPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Today's Todos */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Todos</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100 font-mono">{completedTodayTodos.length}</span>
            <span className="text-xs text-slate-400">/ {todayTodos.length} tasks done</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Pending Tasks</span>
              <span className="font-mono text-emerald-400 font-semibold">{pendingTodayTodos.length} left</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    todayTodos.length > 0 ? Math.round((completedTodayTodos.length / todayTodos.length) * 100) : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Goals Consistency */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Goal Consistency</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100 font-mono">{goalsLoggedTodayCount}</span>
            <span className="text-xs text-slate-400">/ {totalGoals} goals logged</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Today's Habit Rate</span>
              <span className="font-mono text-amber-400 font-semibold">{goalConsistencyPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${goalConsistencyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Skills Learning */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Skills</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100 font-mono">{learningSkills.length}</span>
            <span className="text-xs text-slate-400">skills in progress</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Total Skills: {data.skills.length}</span>
            <button
              onClick={() => setActiveSection('skills')}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              View <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Pending Todos Widget */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Today's Pending Todos
              </h3>
              <button
                onClick={() => setActiveSection('todos')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                Manage All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {pendingTodayTodos.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/40" />
                <p className="text-xs">No pending todos for today! Great job 🎉</p>
                <button
                  onClick={() => openModal('todo')}
                  className="mt-3 text-xs text-indigo-400 hover:underline"
                >
                  + Add new todo
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {pendingTodayTodos.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/40 flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTodoComplete(t.id)}
                        className="text-slate-500 hover:text-emerald-400 transition"
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{t.title || 'Untitled Todo'}</p>
                        {t.category && <span className="text-[10px] text-slate-400">{t.category}</span>}
                      </div>
                    </div>
                    {t.priority && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          t.priority === 'High'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : t.priority === 'Medium'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {t.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Goals Quick Tracker */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" /> Active Goals Progress
              </h3>
              <button
                onClick={() => setActiveSection('goals')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                Log Progress <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {goalsWithStats.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Target className="w-8 h-8 mx-auto mb-2 text-amber-500/40" />
                <p className="text-xs">No active consistency goals set yet.</p>
                <button
                  onClick={() => openModal('goal')}
                  className="mt-3 text-xs text-amber-400 hover:underline"
                >
                  + Create your first habit/goal
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {goalsWithStats.slice(0, 4).map(({ goal, stats, hasLogToday }) => (
                  <div
                    key={goal.id}
                    className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{goal.name || 'Untitled Goal'}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>Streak: 🔥 {stats.currentStreak} days</span>
                        <span>•</span>
                        <span>Target: {goal.targetValue || 1} {goal.unit || 'units'}</span>
                      </div>
                    </div>
                    {hasLogToday ? (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
                        Completed Today ✓
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
                        Pending Today
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
