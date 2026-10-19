import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { JobApplication, JobType, WorkMode, JobStatus, AppSource } from '../../types';
import { X, Briefcase } from 'lucide-react';
import { getTodayStr } from '../../utils/streak';

interface JobFormModalProps {
  jobToEdit?: JobApplication | null;
  onClose: () => void;
}

export const ALL_JOB_STATUSES: JobStatus[] = [
  'Saved',
  'Applied',
  'Application Viewed',
  'Shortlisted',
  'Recruiter Contacted',
  'Assessment',
  'Interview Scheduled',
  'Interview Completed',
  'Technical Round',
  'HR Round',
  'Next Process',
  'Offer Received',
  'Accepted',
  'Rejected',
  'Withdrawn',
  'No Response',
  'On Hold',
  'Other',
];

export const ALL_JOB_TYPES: JobType[] = ['Full Time', 'Part Time', 'Internship', 'Contract', 'Freelance', 'Other'];
export const ALL_WORK_MODES: WorkMode[] = ['Remote', 'Hybrid', 'On-site'];
export const ALL_APP_SOURCES: AppSource[] = [
  'LinkedIn',
  'Naukri',
  'Indeed',
  'Company Website',
  'Referral',
  'Other',
];

export const JobFormModal: React.FC<JobFormModalProps> = ({ jobToEdit, onClose }) => {
  const { addJobApplication, updateJobApplication } = useApp();

  const [companyName, setCompanyName] = useState(jobToEdit?.companyName || '');
  const [jobRole, setJobRole] = useState(jobToEdit?.jobRole || '');
  const [jobType, setJobType] = useState<JobType>(jobToEdit?.jobType || 'Full Time');
  const [location, setLocation] = useState(jobToEdit?.location || '');
  const [workMode, setWorkMode] = useState<WorkMode>(jobToEdit?.workMode || 'Remote');
  const [jobLink, setJobLink] = useState(jobToEdit?.jobLink || '');
  const [companyWebsite, setCompanyWebsite] = useState(jobToEdit?.companyWebsite || '');
  const [salary, setSalary] = useState(jobToEdit?.salary || '');
  const [notes, setNotes] = useState(jobToEdit?.notes || '');

  const [dateApplied, setDateApplied] = useState(jobToEdit?.dateApplied || getTodayStr());
  const [source, setSource] = useState<AppSource>(jobToEdit?.source || 'LinkedIn');
  const [resumeVersion, setResumeVersion] = useState(jobToEdit?.resumeVersion || '');
  const [coverLetter, setCoverLetter] = useState(jobToEdit?.coverLetter || '');
  const [recruiterName, setRecruiterName] = useState(jobToEdit?.recruiterName || '');
  const [recruiterContact, setRecruiterContact] = useState(jobToEdit?.recruiterContact || '');
  const [referralName, setReferralName] = useState(jobToEdit?.referralName || '');
  const [status, setStatus] = useState<JobStatus>(jobToEdit?.status || 'Applied');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<JobApplication> = {
      companyName,
      jobRole,
      jobType,
      location,
      workMode,
      jobLink,
      companyWebsite,
      salary,
      notes,
      dateApplied,
      source,
      resumeVersion,
      coverLetter,
      recruiterName,
      recruiterContact,
      referralName,
      status,
    };

    if (jobToEdit) {
      updateJobApplication(jobToEdit.id, payload);
    } else {
      addJobApplication(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>{jobToEdit ? 'Edit Job Application' : 'Add Job Application'}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Microsoft, Startup"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Job Role / Position</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Engineer, Full Stack Dev"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as JobType)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {ALL_JOB_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {ALL_WORK_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA / Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Salary / Package</label>
                <input
                  type="text"
                  placeholder="e.g. $120,000 / yr"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Job Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={jobLink}
                  onChange={(e) => setJobLink(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Company Website</label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Application Details & Status */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Application Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Date Applied</label>
                <input
                  type="date"
                  value={dateApplied}
                  onChange={(e) => setDateApplied(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as AppSource)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {ALL_APP_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Current Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as JobStatus)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  {ALL_JOB_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Resume Version Used</label>
                <input
                  type="text"
                  placeholder="e.g. Resume_v3_Frontend.pdf"
                  value={resumeVersion}
                  onChange={(e) => setResumeVersion(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Cover Letter Used</label>
                <input
                  type="text"
                  placeholder="e.g. CoverLetter_Frontend.pdf"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Recruiter Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Recruiter Contact Info</label>
                <input
                  type="text"
                  placeholder="Email / Phone / LinkedIn"
                  value={recruiterContact}
                  onChange={(e) => setRecruiterContact(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Referral Name (Optional)</label>
              <input
                type="text"
                placeholder="Name of person who referred you"
                value={referralName}
                onChange={(e) => setReferralName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Notes / Cover Letter Excerpt</label>
              <textarea
                rows={3}
                placeholder="Application notes, cover letter used, key interview takeaways..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
            >
              {jobToEdit ? 'Save Application' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
