import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { calculateSkillStats } from '../../utils/streak';

export const DashboardCharts: React.FC = () => {
  const { data } = useApp();

  // 1. Job Application Funnel / Status Distribution
  const jobStatusCounts: Record<string, number> = {};
  data.jobApplications.forEach((j) => {
    const status = j.status || 'Applied';
    jobStatusCounts[status] = (jobStatusCounts[status] || 0) + 1;
  });

  const jobChartData = Object.keys(jobStatusCounts).map((status) => ({
    name: status,
    count: jobStatusCounts[status],
  }));

  // 2. Todo Priority Distribution
  const todoPriorityCounts = {
    High: data.todos.filter((t) => t.priority === 'High').length,
    Medium: data.todos.filter((t) => t.priority === 'Medium').length,
    Low: data.todos.filter((t) => t.priority === 'Low').length,
  };

  const todoPriorityData = [
    { name: 'High', value: todoPriorityCounts.High, color: '#f43f5e' },
    { name: 'Medium', value: todoPriorityCounts.Medium, color: '#f59e0b' },
    { name: 'Low', value: todoPriorityCounts.Low, color: '#10b981' },
  ];

  // 3. Skill Hours Distribution
  const skillHoursData = data.skills.map((s) => {
    const stats = calculateSkillStats(s);
    return {
      name: s.name || 'Skill',
      hours: Number((stats.totalHours + stats.totalMinutes / 60).toFixed(1)),
    };
  });

  const hasJobData = jobChartData.length > 0;
  const hasTodoData = data.todos.length > 0;
  const hasSkillData = skillHoursData.some((d) => d.hours > 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">Analytics & Insights</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Application Funnel Bar Chart */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">Job Application Pipeline</h3>
            <p className="text-xs text-slate-400 mb-4">Distribution of applications by stage</p>
          </div>

          {hasJobData ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} interval={0} angle={-25} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              No job application data to render chart yet.
            </div>
          )}
        </div>

        {/* Todo Priority Pie Chart */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">Todo Priority Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Breakdown of task urgency levels</p>
          </div>

          {hasTodoData ? (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={todoPriorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {todoPriorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              No todo tasks created yet.
            </div>
          )}
        </div>

        {/* Skill Learning Hours Chart */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between lg:col-span-2">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">Skill Learning Hours</h3>
            <p className="text-xs text-slate-400 mb-4">Total hours spent per skill</p>
          </div>

          {hasSkillData ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillHoursData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                    formatter={(val: any) => [`${val} hrs`, 'Learning Time']}
                  />
                  <Bar dataKey="hours" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              Log skill study sessions to visualize hours spent per skill.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
