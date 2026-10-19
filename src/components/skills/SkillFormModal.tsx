import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Skill, Priority, SkillLevel, SkillStatus } from '../../types';
import { X, BookOpen } from 'lucide-react';
import { getTodayStr } from '../../utils/streak';

interface SkillFormModalProps {
  skillToEdit?: Skill | null;
  onClose: () => void;
}

export const SkillFormModal: React.FC<SkillFormModalProps> = ({ skillToEdit, onClose }) => {
  const { addSkill, updateSkill } = useApp();

  const [name, setName] = useState(skillToEdit?.name || '');
  const [description, setDescription] = useState(skillToEdit?.description || '');
  const [category, setCategory] = useState(skillToEdit?.category || '');
  const [priority, setPriority] = useState<Priority>(skillToEdit?.priority || 'Medium');
  const [startDate, setStartDate] = useState(skillToEdit?.startDate || getTodayStr());
  const [targetDate, setTargetDate] = useState(skillToEdit?.targetDate || '');
  const [currentLevel, setCurrentLevel] = useState<SkillLevel>(skillToEdit?.currentLevel || 'Beginner');
  const [targetLevel, setTargetLevel] = useState<SkillLevel>(skillToEdit?.targetLevel || 'Advanced');
  const [learningResources, setLearningResources] = useState(skillToEdit?.learningResources || '');
  const [status, setStatus] = useState<SkillStatus>(skillToEdit?.status || 'Learning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Skill> = {
      name,
      description,
      category,
      priority,
      startDate,
      targetDate,
      currentLevel,
      targetLevel,
      learningResources,
      status,
    };

    if (skillToEdit) {
      updateSkill(skillToEdit.id, payload);
    } else {
      addSkill(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>{skillToEdit ? 'Edit Skill' : 'Add Skill to Learn'}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Skill Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. React, Python, Machine Learning, System Design, DSA"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Description / Objectives
            </label>
            <textarea
              rows={2}
              placeholder="Why learn this skill? What projects will you build?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Frontend, AI, Backend"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SkillStatus)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="Learning">Learning</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Current Level
              </label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value as SkillLevel)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Target Level
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value as SkillLevel)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Target Mastery Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Learning Resources (Courses, Books, Documentation)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Udemy Course link, Official Documentation, YouTube playlist..."
              value={learningResources}
              onChange={(e) => setLearningResources(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition"
            >
              {skillToEdit ? 'Save Skill' : 'Create Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
