import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { GlobalSearchModal } from './components/GlobalSearchModal';

import { Dashboard } from './components/dashboard/Dashboard';
import { TodoSection } from './components/todos/TodoSection';
import { JobSection } from './components/jobs/JobSection';
import { GoalSection } from './components/goals/GoalSection';
import { SkillSection } from './components/skills/SkillSection';
import { SettingsSection } from './components/settings/SettingsSection';

import { TodoFormModal } from './components/todos/TodoFormModal';
import { JobFormModal } from './components/jobs/JobFormModal';
import { GoalFormModal } from './components/goals/GoalFormModal';
import { SkillFormModal } from './components/skills/SkillFormModal';

const MainContent: React.FC = () => {
  const {
    activeSection,
    isLoading,
    quickActionModalOpen,
    setQuickActionModalOpen,
    activeModalType,
  } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 animate-spin flex items-center justify-center mb-4">
          <div className="w-6 h-6 rounded-lg bg-slate-950" />
        </div>
        <p className="text-sm font-semibold tracking-wide">Loading Nexus Productivity OS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar & Navigation */}
      <Navbar />

      {/* Main Workspace Scroll Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full mb-16 lg:mb-0">
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'todos' && <TodoSection />}
        {activeSection === 'jobs' && <JobSection />}
        {activeSection === 'goals' && <GoalSection />}
        {activeSection === 'skills' && <SkillSection />}
        {activeSection === 'settings' && <SettingsSection />}
      </main>

      {/* Global Search Overlay */}
      <GlobalSearchModal />

      {/* Quick Action Modals Triggered from Sidebar/Dashboard */}
      {quickActionModalOpen && activeModalType === 'todo' && (
        <TodoFormModal onClose={() => setQuickActionModalOpen(false)} />
      )}
      {quickActionModalOpen && activeModalType === 'job' && (
        <JobFormModal onClose={() => setQuickActionModalOpen(false)} />
      )}
      {quickActionModalOpen && activeModalType === 'goal' && (
        <GoalFormModal onClose={() => setQuickActionModalOpen(false)} />
      )}
      {quickActionModalOpen && activeModalType === 'skill' && (
        <SkillFormModal onClose={() => setQuickActionModalOpen(false)} />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
