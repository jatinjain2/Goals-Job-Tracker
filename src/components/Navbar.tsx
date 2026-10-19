import React, { useState } from 'react';
import { useApp, type NavSection } from '../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  Target,
  BookOpen,
  Settings,
  Search,
  Plus,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    setIsSearchOpen,
    openModal,
    data,
    updateSettings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingTodosCount = data.todos.filter((t) => t.status !== 'Completed').length;
  const activeJobsCount = data.jobApplications.filter(
    (j) => !['Rejected', 'Withdrawn', 'Offer Received', 'Accepted'].includes(j.status || '')
  ).length;
  const goalsCount = data.goals.length;
  const skillsCount = data.skills.length;

  const navItems: { id: NavSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'todos', label: 'Todo', icon: <CheckSquare className="w-5 h-5" />, badge: pendingTodosCount },
    { id: 'jobs', label: 'Job Applications', icon: <Briefcase className="w-5 h-5" />, badge: activeJobsCount },
    { id: 'goals', label: 'Goals & Consistency', icon: <Target className="w-5 h-5" />, badge: goalsCount },
    { id: 'skills', label: 'Skills', icon: <BookOpen className="w-5 h-5" />, badge: skillsCount },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (id: NavSection) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    updateSettings({ theme: data.settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 tracking-tight leading-tight m-0">
                Nexus Productivity
              </h1>
              <p className="text-xs text-slate-400 font-medium m-0">Personal OS</p>
            </div>
          </div>
        </div>

        {/* Global Search Button */}
        <div className="p-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs transition shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Search everything...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-700 rounded text-slate-300 font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Quick Add Actions */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openModal('todo')}
              className="px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Todo
            </button>
            <button
              onClick={() => openModal('job')}
              className="px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-medium border border-purple-500/30 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Job
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1.5 py-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Theme Switcher */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Offline LocalDB Active</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Toggle theme"
          >
            {data.settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-100 text-sm">Nexus OS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            <Search className="w-4 h-4" />
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-800 text-slate-300">
            {data.settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-slate-100">Navigation Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-base font-medium ${
                  activeSection === item.id ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span className="mt-0.5">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
