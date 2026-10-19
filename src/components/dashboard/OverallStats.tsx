import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Briefcase,
  Target,
  Clock,
  Award,
  Flame,
  TrendingUp,
  FileCheck,
  XCircle,
} from 'lucide-react';
import { calculateGoalStats, calculateSkillStats } from '../../utils/streak';

export const OverallStats: React.FC = () => {
  const { data } = useApp();

  // Todo Metrics
  const totalTodos = data.todos.length;
  const completedTodos = data.todos.filter((t) => t.status === 'Completed').length;
  const pendingTodos = totalTodos - completedTodos;

  // Job Metrics
  const totalJobs = data.jobApplications.length;

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const jobsThisWeek = data.jobApplications.filter((j) => {
    if (!j.dateApplied) return false;
    const d = new Date(j.dateApplied);
    return !isNaN(d.getTime()) && d >= startOfWeek;
  }).length;

  const jobsThisMonth = data.jobApplications.filter((j) => {
    if (!j.dateApplied) return false;
    const d = new Date(j.dateApplied);
    return !isNaN(d.getTime()) && d >= startOfMonth;
  }).length;

  const interviewsCount = data.jobApplications.filter((j) =>
    [
      'Interview Scheduled',
      'Interview Completed',
      'Technical Round',
      'HR Round',
      'Next Process',
      'Offer Received',
      'Accepted',
    ].includes(j.status || '')
  ).length;

  const rejectedCount = data.jobApplications.filter((j) => j.status === 'Rejected').length;

  // Goal & Consistency Metrics
  const activeGoals = data.goals.length;
  let bestStreak = 0;
  let totalGoalDaysLogged = 0;
  let totalGoalDaysCompleted = 0;

  data.goals.forEach((g) => {
    const stats = calculateGoalStats(g);
    if (stats.longestStreak > bestStreak) {
      bestStreak = stats.longestStreak;
    }
    totalGoalDaysCompleted += stats.totalCompletedDays;
    totalGoalDaysLogged += stats.totalCompletedDays + stats.totalMissedDays;
  });

  const overallConsistencyPercent =
    totalGoalDaysLogged > 0 ? Math.round((totalGoalDaysCompleted / totalGoalDaysLogged) * 100) : 0;

  // Skill Metrics
  let totalLearningHoursFloat = 0;
  data.skills.forEach((s) => {
    const stats = calculateSkillStats(s);
    totalLearningHoursFloat += stats.totalHours + stats.totalMinutes / 60;
  });
  const totalLearningHours = Math.round(totalLearningHoursFloat);

  const statsList = [
    { label: 'Total Todos', value: totalTodos, icon: <CheckSquare className="w-4 h-4 text-emerald-400" /> },
    { label: 'Completed Todos', value: completedTodos, icon: <FileCheck className="w-4 h-4 text-teal-400" /> },
    { label: 'Pending Todos', value: pendingTodos, icon: <Clock className="w-4 h-4 text-amber-400" /> },

    { label: 'Total Jobs Applied', value: totalJobs, icon: <Briefcase className="w-4 h-4 text-indigo-400" /> },
    { label: 'Jobs (This Week)', value: jobsThisWeek, icon: <TrendingUp className="w-4 h-4 text-purple-400" /> },
    { label: 'Jobs (This Month)', value: jobsThisMonth, icon: <TrendingUp className="w-4 h-4 text-indigo-300" /> },

    { label: 'Interviews / Next Round', value: interviewsCount, icon: <Award className="w-4 h-4 text-yellow-400" /> },
    { label: 'Rejected Applications', value: rejectedCount, icon: <XCircle className="w-4 h-4 text-rose-400" /> },

    { label: 'Active Consistency Goals', value: activeGoals, icon: <Target className="w-4 h-4 text-amber-400" /> },
    { label: 'Current Best Streak', value: `🔥 ${bestStreak} d`, icon: <Flame className="w-4 h-4 text-orange-500" /> },
    { label: 'Total Learning Hours', value: `${totalLearningHours} hrs`, icon: <Clock className="w-4 h-4 text-cyan-400" /> },
    {
      label: 'Overall Consistency',
      value: `${overallConsistencyPercent}%`,
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">Overall Statistics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {statsList.map((st, i) => (
          <div
            key={i}
            className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-slate-700 transition flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-medium text-slate-400">{st.label}</p>
              <p className="text-xl font-bold text-slate-100 font-mono mt-0.5">{st.value}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">{st.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
