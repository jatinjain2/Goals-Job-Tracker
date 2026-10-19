import React from 'react';
import type { JobApplication, JobStatus } from '../../types';
import { formatDateDisplay } from '../../utils/streak';

interface JobKanbanViewProps {
  jobs: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
}

const KANBAN_COLUMNS: { title: string; statuses: JobStatus[]; color: string }[] = [
  { title: 'Saved / Wishlist', statuses: ['Saved'], color: 'border-slate-700 bg-slate-900/50' },
  { title: 'Applied / Viewed', statuses: ['Applied', 'Application Viewed'], color: 'border-indigo-800/80 bg-indigo-950/20' },
  {
    title: 'Shortlisted & Recruiter',
    statuses: ['Shortlisted', 'Recruiter Contacted'],
    color: 'border-cyan-800/80 bg-cyan-950/20',
  },
  {
    title: 'Assessment & Rounds',
    statuses: [
      'Assessment',
      'Interview Scheduled',
      'Interview Completed',
      'Technical Round',
      'HR Round',
      'Next Process',
    ],
    color: 'border-amber-800/80 bg-amber-950/20',
  },
  { title: 'Offer Received', statuses: ['Offer Received', 'Accepted'], color: 'border-emerald-800/80 bg-emerald-950/20' },
  {
    title: 'Closed / Rejected',
    statuses: ['Rejected', 'Withdrawn', 'No Response', 'On Hold', 'Other'],
    color: 'border-rose-800/80 bg-rose-950/20',
  },
];

export const JobKanbanView: React.FC<JobKanbanViewProps> = ({ jobs, onSelectJob }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((col) => {
        const colJobs = jobs.filter((j) => col.statuses.includes(j.status || 'Applied'));

        return (
          <div key={col.title} className={`p-3 rounded-2xl border ${col.color} min-w-[220px] flex flex-col`}>
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{col.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 font-mono text-slate-300">
                {colJobs.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
              {colJobs.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-slate-800 rounded-xl text-[11px] text-slate-500">
                  No applications
                </div>
              ) : (
                colJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className="p-3.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/80 rounded-xl cursor-pointer transition shadow-md group space-y-2"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-400 transition truncate">
                        {job.companyName || 'Company'}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono shrink-0">
                        {job.status}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-300 truncate">{job.jobRole || 'Position'}</p>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                      {job.workMode && <span className="bg-slate-800/80 px-1.5 py-0.5 rounded">{job.workMode}</span>}
                      {job.salary && (
                        <span className="text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded">
                          {job.salary}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{formatDateDisplay(job.dateApplied)}</span>
                      <span className="text-indigo-400 hover:underline font-medium">View Timeline</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
