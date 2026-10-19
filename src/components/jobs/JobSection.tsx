import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { JobApplication } from '../../types';
import { JobTargetCard } from './JobTargetCard';
import { JobFormModal, ALL_JOB_STATUSES, ALL_APP_SOURCES } from './JobFormModal';
import { JobDetailModal } from './JobDetailModal';
import { JobKanbanView } from './JobKanbanView';
import { JobCalendarView } from './JobCalendarView';
import {
  Briefcase,
  Plus,
  Search,
  Table as TableIcon,
  Kanban,
  Calendar as CalendarIcon,
  Edit2,
} from 'lucide-react';
import { getTodayStr, formatDateDisplay } from '../../utils/streak';

export const JobSection: React.FC = () => {
  const { data } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'calendar'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<JobApplication | null>(null);
  const [jobToEdit, setJobToEdit] = useState<JobApplication | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'status'>('date');

  const todayStr = getTodayStr();

  // Application Counters & Stats
  const totalApps = data.jobApplications.length;

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const appsToday = data.jobApplications.filter((j) => j.dateApplied === todayStr).length;

  const appsThisWeek = data.jobApplications.filter((j) => {
    if (!j.dateApplied) return false;
    const d = new Date(j.dateApplied);
    return !isNaN(d.getTime()) && d >= startOfWeek;
  }).length;

  const appsThisMonth = data.jobApplications.filter((j) => {
    if (!j.dateApplied) return false;
    const d = new Date(j.dateApplied);
    return !isNaN(d.getTime()) && d >= startOfMonth;
  }).length;

  const appsThisYear = data.jobApplications.filter((j) => {
    if (!j.dateApplied) return false;
    const d = new Date(j.dateApplied);
    return !isNaN(d.getTime()) && d >= startOfYear;
  }).length;

  const shortlistedCount = data.jobApplications.filter((j) => j.status === 'Shortlisted').length;
  const interviewsCount = data.jobApplications.filter((j) =>
    ['Interview Scheduled', 'Interview Completed', 'Technical Round', 'HR Round'].includes(j.status || '')
  ).length;

  const assessmentsCount = data.jobApplications.filter((j) => j.status === 'Assessment').length;
  const offersCount = data.jobApplications.filter((j) => ['Offer Received', 'Accepted'].includes(j.status || '')).length;
  const rejectedCount = data.jobApplications.filter((j) => j.status === 'Rejected').length;
  const noResponseCount = data.jobApplications.filter((j) => j.status === 'No Response').length;

  const activeAppsCount = data.jobApplications.filter(
    (j) => !['Rejected', 'Withdrawn', 'Accepted'].includes(j.status || '')
  ).length;

  const interviewConversionRate = totalApps > 0 ? Math.round((interviewsCount / totalApps) * 100) : 0;
  const offerRate = totalApps > 0 ? Math.round((offersCount / totalApps) * 100) : 0;

  // Filtered & Sorted Jobs
  const filteredJobs = data.jobApplications.filter((j) => {
    if (search) {
      const q = search.toLowerCase();
      const matchComp = j.companyName?.toLowerCase().includes(q);
      const matchRole = j.jobRole?.toLowerCase().includes(q);
      const matchLoc = j.location?.toLowerCase().includes(q);
      const matchNotes = j.notes?.toLowerCase().includes(q);
      if (!matchComp && !matchRole && !matchLoc && !matchNotes) return false;
    }

    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    if (sourceFilter !== 'all' && j.source !== sourceFilter) return false;

    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'date') {
      return (b.dateApplied || '').localeCompare(a.dateApplied || '');
    }
    if (sortBy === 'company') {
      return (a.companyName || '').localeCompare(b.companyName || '');
    }
    if (sortBy === 'status') {
      return (a.status || '').localeCompare(b.status || '');
    }
    return 0;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-400" /> Job Application Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track applications, interviews, timeline events & targets</p>
        </div>

        <button
          onClick={() => {
            setJobToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Target Progress Card */}
      <JobTargetCard />

      {/* Application Summary Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Apps</p>
          <p className="text-xl font-bold text-slate-100 font-mono mt-0.5">{totalApps}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{appsToday} applied today</p>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-indigo-400 font-semibold uppercase">Active Apps</p>
          <p className="text-xl font-bold text-indigo-300 font-mono mt-0.5">{activeAppsCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{appsThisWeek} week • {appsThisMonth} month</p>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-amber-400 font-semibold uppercase">Interviews</p>
          <p className="text-xl font-bold text-amber-300 font-mono mt-0.5">{interviewsCount}</p>
          <p className="text-[10px] text-amber-400/80 mt-0.5">{interviewConversionRate}% conversion</p>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-cyan-400 font-semibold uppercase">Assessments</p>
          <p className="text-xl font-bold text-cyan-300 font-mono mt-0.5">{assessmentsCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{shortlistedCount} shortlisted ({appsThisYear} YTD)</p>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-emerald-400 font-semibold uppercase">Offers</p>
          <p className="text-xl font-bold text-emerald-300 font-mono mt-0.5">{offersCount}</p>
          <p className="text-[10px] text-emerald-400/80 mt-0.5">{offerRate}% offer rate</p>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-rose-400 font-semibold uppercase">Rejected</p>
          <p className="text-xl font-bold text-rose-400 font-mono mt-0.5">{rejectedCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{noResponseCount} no response</p>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by company, role, location, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700/80 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
                viewMode === 'table' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-4 h-4" /> Table List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
                viewMode === 'kanban' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-4 h-4" /> Kanban Board
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
                viewMode === 'calendar' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4" /> Calendar
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {ALL_JOB_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Sources</option>
            {ALL_APP_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="date">Sort: Date Applied</option>
            <option value="company">Sort: Company Name</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'kanban' ? (
        <JobKanbanView jobs={sortedJobs} onSelectJob={(job) => setSelectedJobForDetail(job)} />
      ) : viewMode === 'calendar' ? (
        <JobCalendarView jobs={sortedJobs} onSelectJob={(job) => setSelectedJobForDetail(job)} />
      ) : (
        /* Table / List View */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-x-auto">
          {sortedJobs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Briefcase className="w-12 h-12 mx-auto text-purple-500/40" />
              <p className="text-sm">No job applications match your filters.</p>
              <button
                onClick={() => {
                  setJobToEdit(null);
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl"
              >
                + Add Application
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Company & Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date Applied</th>
                  <th className="p-3.5">Location / Mode</th>
                  <th className="p-3.5">Source</th>
                  <th className="p-3.5">Salary</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-800/50 transition cursor-pointer"
                    onClick={() => setSelectedJobForDetail(job)}
                  >
                    <td className="p-3.5 font-medium">
                      <div className="text-slate-100 font-bold">{job.companyName || 'Company'}</div>
                      <div className="text-purple-400">{job.jobRole || 'Position'}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-950 text-purple-300 border border-purple-800">
                        {job.status || 'Applied'}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-slate-400">{formatDateDisplay(job.dateApplied)}</td>

                    <td className="p-3.5 text-slate-400">
                      {job.location || 'Remote'} ({job.workMode})
                    </td>

                    <td className="p-3.5 text-slate-400">{job.source || 'N/A'}</td>

                    <td className="p-3.5 font-mono text-emerald-400">{job.salary || '-'}</td>

                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedJobForDetail(job)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setJobToEdit(job);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isAddModalOpen && (
        <JobFormModal
          jobToEdit={jobToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setJobToEdit(null);
          }}
        />
      )}

      {/* Detail Modal */}
      {selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          onClose={() => setSelectedJobForDetail(null)}
          onEdit={() => {
            setJobToEdit(selectedJobForDetail);
            setSelectedJobForDetail(null);
            setIsAddModalOpen(true);
          }}
        />
      )}
    </div>
  );
};
