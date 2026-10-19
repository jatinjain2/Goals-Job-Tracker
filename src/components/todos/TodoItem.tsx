import React, { useState } from 'react';
import type { Todo } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getTodayStr, formatDateDisplay } from '../../utils/streak';

interface TodoItemProps {
  todo: Todo;
  viewMode: 'list' | 'compact';
  onEdit: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, viewMode, onEdit }) => {
  const { toggleTodoComplete, deleteTodo, updateTodo } = useApp();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const todayStr = getTodayStr();
  const isCompleted = todo.status === 'Completed';
  const isOverdue = !isCompleted && todo.dueDate && todo.dueDate < todayStr;
  const isDueToday = !isCompleted && todo.dueDate === todayStr;

  const totalSubtasks = todo.subtasks?.length || 0;
  const completedSubtasks = todo.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleSubtaskToggle = (subtaskId: string) => {
    if (!todo.subtasks) return;
    const updatedSubtasks = todo.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTodo(todo.id, { subtasks: updatedSubtasks });
  };

  if (viewMode === 'compact') {
    return (
      <div
        className={`p-3 bg-slate-900/80 border rounded-xl flex items-center justify-between transition ${
          isCompleted
            ? 'border-slate-800 opacity-60'
            : isOverdue
            ? 'border-rose-800/80 bg-rose-950/10'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => toggleTodoComplete(todo.id)}
            className={`shrink-0 transition ${isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'}`}
          >
            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className={`text-xs font-semibold truncate ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {todo.title || 'Untitled Todo'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          {todo.priority && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                todo.priority === 'High'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : todo.priority === 'Medium'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {todo.priority}
            </span>
          )}
          {isOverdue && (
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-950 text-rose-400 border border-rose-800">
              Overdue
            </span>
          )}
          <button onClick={() => onEdit(todo)} className="text-slate-400 hover:text-slate-200 p-1">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => deleteTodo(todo.id)} className="text-slate-400 hover:text-rose-400 p-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-slate-900/90 border rounded-2xl transition space-y-3 ${
        isCompleted
          ? 'border-slate-800/80 bg-slate-900/40 opacity-70'
          : isOverdue
          ? 'border-rose-800/80 bg-rose-950/20 shadow-lg shadow-rose-950/20'
          : isDueToday
          ? 'border-amber-500/50 bg-amber-950/10'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => toggleTodoComplete(todo.id)}
            className={`mt-0.5 shrink-0 transition ${
              isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-bold tracking-tight ${
                isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
              }`}
            >
              {todo.title || 'Untitled Todo'}
            </h3>
            {todo.description && (
              <p className="text-xs text-slate-400 mt-1 whitespace-pre-wrap">{todo.description}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1 bg-rose-950 p-1 rounded-lg border border-rose-800">
              <span className="text-[10px] text-rose-300 font-semibold px-1">Delete?</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] rounded font-bold"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
        {/* Status Badge */}
        <span
          className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
            todo.status === 'Completed'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              : todo.status === 'In Progress'
              ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {todo.status || 'Pending'}
        </span>

        {/* Priority Badge */}
        {todo.priority && (
          <span
            className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
              todo.priority === 'High'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : todo.priority === 'Medium'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {todo.priority} Priority
          </span>
        )}

        {/* Category Badge */}
        {todo.category && (
          <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
            {todo.category}
          </span>
        )}

        {/* Due Date Indicator */}
        {todo.dueDate && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono ${
              isOverdue
                ? 'bg-rose-950 text-rose-300 border border-rose-700 font-bold'
                : isDueToday
                ? 'bg-amber-950 text-amber-300 border border-amber-700 font-semibold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Calendar className="w-3 h-3" />
            {formatDateDisplay(todo.dueDate)} {todo.dueTime ? `@ ${todo.dueTime}` : ''}
            {isOverdue && ' (OVERDUE)'}
            {isDueToday && ' (TODAY)'}
          </span>
        )}

        {/* Tags */}
        {todo.tags?.map((tg) => (
          <span key={tg} className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
            #{tg}
          </span>
        ))}
      </div>

      {/* Subtasks Progress Bar & Toggle */}
      {totalSubtasks > 0 && (
        <div className="pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="flex items-center gap-1.5 hover:text-slate-200 font-medium"
            >
              <span>
                Subtasks ({completedSubtasks}/{totalSubtasks})
              </span>
              {showSubtasks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="font-mono text-indigo-400">{subtaskPercent}%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${subtaskPercent}%` }}
            />
          </div>

          {showSubtasks && (
            <div className="mt-3 space-y-1.5 pl-2 border-l-2 border-indigo-500/30">
              {todo.subtasks?.map((st) => (
                <label key={st.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => handleSubtaskToggle(st.id)}
                    className="rounded border-slate-700 bg-slate-800 text-indigo-600"
                  />
                  <span className={st.completed ? 'line-through text-slate-500' : ''}>{st.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
