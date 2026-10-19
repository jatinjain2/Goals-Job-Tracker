import React, { useState } from 'react';
import type { JobApplication } from '../../types';
import { ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

interface JobCalendarViewProps {
  jobs: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
}

export const JobCalendarView: React.FC<JobCalendarViewProps> = ({ jobs, onSelectJob }) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDay.getDay(); // 0 = Sun
  const daysInMonth = lastDay.getDate();

  const monthName = currentMonthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));

  // Map jobs by date YYYY-MM-DD
  const jobsByDate: Record<string, JobApplication[]> = {};
  jobs.forEach((job) => {
    if (job.dateApplied) {
      if (!jobsByDate[job.dateApplied]) jobsByDate[job.dateApplied] = [];
      jobsByDate[job.dateApplied].push(job);
    }
  });

  const calendarCells = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
      {/* Month Selector Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" /> {monthName}
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentMonthDate(new Date())} className="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded-lg">
            Today
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarCells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty_${idx}`} className="h-24 bg-slate-950/20 rounded-xl" />;
          }

          const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayJobs = jobsByDate[dayStr] || [];

          return (
            <div
              key={dayStr}
              className="h-24 p-2 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between overflow-hidden hover:border-slate-700"
            >
              <span className="text-xs font-mono font-bold text-slate-300">{day}</span>

              <div className="space-y-1 overflow-y-auto max-h-16 pr-0.5">
                {dayJobs.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => onSelectJob(j)}
                    className="p-1 bg-indigo-950/80 border border-indigo-800/80 rounded text-[10px] text-indigo-200 truncate cursor-pointer hover:bg-indigo-900"
                    title={`${j.companyName} - ${j.jobRole}`}
                  >
                    {j.companyName || 'Job'}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
