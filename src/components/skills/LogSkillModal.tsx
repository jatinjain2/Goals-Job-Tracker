import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Skill } from '../../types';
import { X, BookOpen } from 'lucide-react';
import { getTodayStr } from '../../utils/streak';

interface LogSkillModalProps {
  skill: Skill;
  onClose: () => void;
}

export const LogSkillModal: React.FC<LogSkillModalProps> = ({ skill, onClose }) => {
  const { logSkillLearning } = useApp();

  const [date, setDate] = useState(getTodayStr());
  const [hours, setHours] = useState<number | ''>(1);
  const [minutes, setMinutes] = useState<number | ''>(0);
  const [topicLearned, setTopicLearned] = useState('');
  const [notes, setNotes] = useState('');
  const [resourceLink, setResourceLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logSkillLearning(skill.id, {
      id: '',
      date,
      hours: typeof hours === 'number' ? hours : 0,
      minutes: typeof minutes === 'number' ? minutes : 0,
      topicLearned,
      notes,
      resourceLink,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" /> Log Study Session
            </h2>
            <p className="text-xs text-cyan-400 font-semibold">{skill.name || 'Skill'}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Date Studied</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Hours Studied</label>
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Minutes Studied</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Topic / Concept Learned</label>
            <input
              type="text"
              placeholder="e.g. React Hooks, Docker Containers, Async/Await"
              value={topicLearned}
              onChange={(e) => setTopicLearned(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Study Notes / Takeaways</label>
            <textarea
              rows={2}
              placeholder="Key notes, code snippets, or practice details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2 text-slate-100 resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Resource / Article Link (Optional)</label>
            <input
              type="url"
              placeholder="https://docs.reference.com"
              value={resourceLink}
              onChange={(e) => setResourceLink(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-600/20"
            >
              Log Study Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
