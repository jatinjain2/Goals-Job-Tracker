import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { JobApplication, JobStatus } from '../../types';
import { ALL_JOB_STATUSES } from './JobFormModal';
import {
  X,
  Building2,
  MapPin,
  ExternalLink,
  DollarSign,
  Plus,
  History,
} from 'lucide-react';
import { getTodayStr, formatDateDisplay } from '../../utils/streak';

interface JobDetailModalProps {
  job: JobApplication;
  onClose: () => void;
  onEdit: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, onEdit }) => {
  const { updateJobApplication, addJobTimelineUpdate, deleteJobApplication } = useApp();

  const [newStatus, setNewStatus] = useState<JobStatus>(job.status || 'Applied');
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateLink, setUpdateLink] = useState('');
  const [updateDate, setUpdateDate] = useState(getTodayStr());
  const [showAddUpdate, setShowAddUpdate] = useState(false);

  const handleStatusChange = (status: JobStatus) => {
    setNewStatus(status);
    updateJobApplication(job.id, { status });
  };

  const handleAddTimelineEntry = (e: React.FormEvent) => {
    e.preventDefault();
    addJobTimelineUpdate(job.id, {
      date: updateDate,
      status: newStatus,
      notes: updateNotes,
      link: updateLink,
    });
    setUpdateNotes('');
    setUpdateLink('');
    setShowAddUpdate(false);
  };

  const timeline = job.timeline || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                {job.status || 'Applied'}
              </span>
              <span className="text-xs text-slate-400">Applied on {formatDateDisplay(job.dateApplied)}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 mt-2">
              {job.jobRole || 'Position'} <span className="text-indigo-400">@ {job.companyName || 'Company'}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
              {job.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>}
              {job.workMode && <span>• {job.workMode}</span>}
              {job.jobType && <span>• {job.jobType}</span>}
              {job.salary && <span className="flex items-center gap-1 text-emerald-400 font-mono"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              Edit
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Quick Status Bar */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Update Status</span>
              <select
                value={newStatus}
                onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
              >
                {ALL_JOB_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {job.jobLink && (
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Job Link
                </a>
              )}
              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" /> Website
                </a>
              )}
            </div>
          </div>

          {/* Details Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Application Info</h4>
              <p><span className="text-slate-400">Source:</span> <strong className="text-slate-200">{job.source || 'N/A'}</strong></p>
              <p><span className="text-slate-400">Resume Version:</span> <strong className="text-slate-200">{job.resumeVersion || 'Default'}</strong></p>
              <p><span className="text-slate-400">Referral:</span> <strong className="text-slate-200">{job.referralName || 'None'}</strong></p>
            </div>

            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Recruiter Details</h4>
              <p><span className="text-slate-400">Recruiter Name:</span> <strong className="text-slate-200">{job.recruiterName || 'Not specified'}</strong></p>
              <p><span className="text-slate-400">Contact:</span> <strong className="text-slate-200">{job.recruiterContact || 'N/A'}</strong></p>
            </div>
          </div>

          {job.notes && (
            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
              <h4 className="font-bold text-slate-300 text-xs mb-1">Notes & Cover Letter</h4>
              <p className="text-xs text-slate-400 whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}

          {/* Timeline / Activity History */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" /> Timeline & Activity History
              </h3>
              <button
                onClick={() => setShowAddUpdate(!showAddUpdate)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Log Update
              </button>
            </div>

            {/* Add Update Form */}
            {showAddUpdate && (
              <form onSubmit={handleAddTimelineEntry} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Update Date</label>
                    <input
                      type="date"
                      value={updateDate}
                      onChange={(e) => setUpdateDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Status at this stage</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as JobStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                    >
                      {ALL_JOB_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Notes / Feedback</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Completed technical round, interviewer gave positive feedback..."
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Optional Link / Attachment</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={updateLink}
                    onChange={(e) => setUpdateLink(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUpdate(false)}
                    className="px-3 py-1.5 bg-slate-900 text-slate-400 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Save Activity Log
                  </button>
                </div>
              </form>
            )}

            {/* Timeline List */}
            {timeline.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No activity updates logged yet.</p>
            ) : (
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
                {timeline.map((entry) => (
                  <div key={entry.id} className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900" />
                    <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{entry.status || 'Update'}</span>
                        <span className="text-[11px] font-mono text-slate-400">{formatDateDisplay(entry.date)}</span>
                      </div>
                      {entry.notes && <p className="text-slate-300">{entry.notes}</p>}
                      {entry.link && (
                        <a
                          href={entry.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" /> View Attachment / Link
                        </a>
                      )}
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
              if (confirm('Are you sure you want to delete this application?')) {
                deleteJobApplication(job.id);
                onClose();
              }
            }}
            className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold rounded-xl border border-rose-800"
          >
            Delete Application
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
