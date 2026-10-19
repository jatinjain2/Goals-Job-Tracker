import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Goal, Frequency } from '../../types';
import { X, Target } from 'lucide-react';
import { getTodayStr } from '../../utils/streak';

interface GoalFormModalProps {
  goalToEdit?: Goal | null;
  onClose: () => void;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({ goalToEdit, onClose }) => {
  const { addGoal, updateGoal } = useApp();

  const [name, setName] = useState(goalToEdit?.name || '');
  const [description, setDescription] = useState(goalToEdit?.description || '');
  const [category, setCategory] = useState(goalToEdit?.category || '');
  const [startDate, setStartDate] = useState(goalToEdit?.startDate || getTodayStr());
  const [endDate, setEndDate] = useState(goalToEdit?.endDate || '');
  const [frequency, setFrequency] = useState<Frequency>(goalToEdit?.frequency || 'Daily');
  const [targetValue, setTargetValue] = useState<number | ''>(goalToEdit?.targetValue ?? 1);
  const [unit, setUnit] = useState(goalToEdit?.unit || 'times');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Goal> = {
      name,
      description,
      category,
      startDate,
      endDate,
      frequency,
      targetValue: typeof targetValue === 'number' ? targetValue : 1,
      unit,
    };

    if (goalToEdit) {
      updateGoal(goalToEdit.id, payload);
    } else {
      addGoal(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span>{goalToEdit ? 'Edit Goal' : 'Create Consistency Goal'}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Goal Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Learn Python, Read 20 pages, Drink Water, Exercise"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Why is this habit important to you?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Health, Study, Career, Personal"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Daily">Daily Habit</option>
                <option value="Weekly">Weekly Goal</option>
                <option value="Monthly">Monthly Goal</option>
                <option value="Custom">Custom Target</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Target Value
              </label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 2, 20, 4"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Unit of Measurement
              </label>
              <input
                type="text"
                placeholder="e.g. hours, pages, litres, apps, times"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
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
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Form Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 transition"
            >
              {goalToEdit ? 'Save Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
