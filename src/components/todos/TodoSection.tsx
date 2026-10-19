import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Todo } from '../../types';
import { TodoItem } from './TodoItem';
import { TodoFormModal } from './TodoFormModal';
import {
  CheckSquare,
  Plus,
  Search,
  List,
  LayoutGrid,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { getTodayStr } from '../../utils/streak';

export const TodoSection: React.FC = () => {
  const { data } = useApp();
  const todayStr = getTodayStr();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created'>('dueDate');
  const [viewMode, setViewMode] = useState<'list' | 'compact'>('list');

  const categories = Array.from(new Set(data.todos.map((t) => t.category).filter(Boolean)));

  const handleEdit = (todo: Todo) => {
    setTodoToEdit(todo);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setTodoToEdit(null);
    setIsModalOpen(true);
  };

  // Filtering
  const filteredTodos = data.todos.filter((t) => {
    // Search
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCat = t.category?.toLowerCase().includes(q);
      const matchTag = t.tags?.some((tg) => tg.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCat && !matchTag) return false;
    }

    // Status Filter
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;

    // Priority Filter
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

    // Category Filter
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

    // Date Filter
    if (dateFilter === 'overdue') {
      if (!t.dueDate || t.dueDate >= todayStr || t.status === 'Completed') return false;
    } else if (dateFilter === 'today') {
      if (t.dueDate !== todayStr) return false;
    } else if (dateFilter === 'upcoming') {
      if (!t.dueDate || t.dueDate <= todayStr) return false;
    }

    return true;
  });

  // Sorting
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === 'priority') {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      const aVal = pMap[a.priority || 'Low'] || 0;
      const bVal = pMap[b.priority || 'Low'] || 0;
      return bVal - aVal;
    }
    if (sortBy === 'created') {
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    }
    return 0;
  });

  const activeTodos = sortedTodos.filter((t) => t.status !== 'Completed');
  const completedTodos = sortedTodos.filter((t) => t.status === 'Completed');

  const overdueCount = data.todos.filter(
    (t) => t.status !== 'Completed' && t.dueDate && t.dueDate < todayStr
  ).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" /> Todo Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Organize, prioritize, and track your daily tasks</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Todo
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search todos by title, description, category, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700/80 shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" /> Detailed
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
                viewMode === 'compact' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Compact
            </button>
          </div>
        </div>

        {/* Filters Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 text-xs">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Dates</option>
            <option value="today">Due Today</option>
            <option value="overdue">Overdue ({overdueCount})</option>
            <option value="upcoming">Upcoming</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="created">Sort: Date Created</option>
          </select>
        </div>
      </div>

      {/* Overdue Warning Alert if any */}
      {overdueCount > 0 && dateFilter !== 'overdue' && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              You have <strong className="font-mono">{overdueCount}</strong> overdue task(s) requiring attention.
            </span>
          </div>
          <button
            onClick={() => setDateFilter('overdue')}
            className="underline font-semibold hover:text-rose-200 shrink-0"
          >
            Filter Overdue
          </button>
        </div>
      )}

      {/* Active Tasks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Active Todos ({activeTodos.length})
          </h2>
        </div>

        {activeTodos.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <CheckCircle2 className="w-12 h-12 mx-auto text-indigo-500/40" />
            <p className="text-sm">No active tasks found for the current filters.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
            >
              + Create New Todo
            </button>
          </div>
        ) : (
          <div className={viewMode === 'compact' ? 'space-y-2' : 'space-y-3'}>
            {activeTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} viewMode={viewMode} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Section */}
      {completedTodos.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Completed Tasks ({completedTodos.length})
          </h2>
          <div className={viewMode === 'compact' ? 'space-y-2' : 'space-y-3'}>
            {completedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} viewMode={viewMode} onEdit={handleEdit} />
            ))}
          </div>
        </div>
      )}

      {/* Todo Form Modal */}
      {isModalOpen && <TodoFormModal todoToEdit={todoToEdit} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
