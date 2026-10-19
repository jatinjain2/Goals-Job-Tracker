import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type {
  AppData,
  DailyGoalLog,
  Goal,
  JobApplication,
  JobTargets,
  JobTimelineUpdate,
  SettingsState,
  Skill,
  SkillLog,
  Todo,
} from '../types';
import { clearAllAppData, exportDataAsJSON, initialAppData, loadAppData, saveAppData } from '../services/storage';
import { getTodayStr } from '../utils/streak';

export type NavSection = 'dashboard' | 'todos' | 'jobs' | 'goals' | 'skills' | 'settings';

interface AppContextType {
  data: AppData;
  isLoading: boolean;
  activeSection: NavSection;
  setActiveSection: (sec: NavSection) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Modals state
  quickActionModalOpen: boolean;
  setQuickActionModalOpen: (open: boolean) => void;
  activeModalType: 'todo' | 'job' | 'goal' | 'skill' | null;
  openModal: (type: 'todo' | 'job' | 'goal' | 'skill') => void;

  // CRUD Todos
  addTodo: (todo: Partial<Todo>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoComplete: (id: string) => void;

  // CRUD Jobs
  addJobApplication: (job: Partial<JobApplication>) => void;
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteJobApplication: (id: string) => void;
  addJobTimelineUpdate: (jobId: string, update: Partial<JobTimelineUpdate>) => void;
  updateJobTargets: (targets: Partial<JobTargets>) => void;

  // CRUD Goals
  addGoal: (goal: Partial<Goal>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  logGoalProgress: (goalId: string, dateStr: string, log: DailyGoalLog) => void;

  // CRUD Skills
  addSkill: (skill: Partial<Skill>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  logSkillLearning: (skillId: string, log: SkillLog) => void;

  // Settings & Storage
  updateSettings: (settings: Partial<SettingsState>) => void;
  exportData: () => void;
  importData: (imported: AppData) => void;
  resetAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialAppData);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [quickActionModalOpen, setQuickActionModalOpen] = useState(false);
  const [activeModalType, setActiveModalType] = useState<'todo' | 'job' | 'goal' | 'skill' | null>(null);

  const openModal = (type: 'todo' | 'job' | 'goal' | 'skill') => {
    setActiveModalType(type);
    setQuickActionModalOpen(true);
  };

  // Initial Load from Storage
  useEffect(() => {
    loadAppData().then((loaded) => {
      setData(loaded);
      setIsLoading(false);
    });
  }, []);

  // Save to storage on state change
  useEffect(() => {
    if (!isLoading) {
      saveAppData(data);
    }
  }, [data, isLoading]);

  // Apply theme class to document body
  useEffect(() => {
    if (data.settings.theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [data.settings.theme]);

  // --- TODO HANDLERS ---
  const addTodo = (todo: Partial<Todo>) => {
    const newTodo: Todo = {
      id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      status: todo.status || 'Pending',
      priority: todo.priority || 'Medium',
      subtasks: [],
      ...todo,
    };
    setData((prev) => ({
      ...prev,
      todos: [newTodo, ...prev.todos],
    }));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setData((prev) => ({
      ...prev,
      todos: prev.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const deleteTodo = (id: string) => {
    setData((prev) => ({
      ...prev,
      todos: prev.todos.filter((t) => t.id !== id),
    }));
  };

  const toggleTodoComplete = (id: string) => {
    setData((prev) => ({
      ...prev,
      todos: prev.todos.map((t) => {
        if (t.id === id) {
          const isComp = t.status === 'Completed';
          return {
            ...t,
            status: isComp ? 'Pending' : 'Completed',
            completedAt: !isComp ? new Date().toISOString() : undefined,
          };
        }
        return t;
      }),
    }));
  };

  // --- JOB HANDLERS ---
  const addJobApplication = (job: Partial<JobApplication>) => {
    const today = getTodayStr();
    const newJob: JobApplication = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      dateApplied: job.dateApplied || today,
      status: job.status || 'Applied',
      timeline: [
        {
          id: `tl_${Date.now()}`,
          date: job.dateApplied || today,
          status: job.status || 'Applied',
          notes: 'Application created',
        },
      ],
      ...job,
    };
    setData((prev) => ({
      ...prev,
      jobApplications: [newJob, ...prev.jobApplications],
    }));
  };

  const updateJobApplication = (id: string, updates: Partial<JobApplication>) => {
    setData((prev) => ({
      ...prev,
      jobApplications: prev.jobApplications.map((j) => {
        if (j.id === id) {
          const newStatus = updates.status && updates.status !== j.status ? updates.status : j.status;
          let timeline = j.timeline || [];
          if (updates.status && updates.status !== j.status) {
            timeline = [
              {
                id: `tl_${Date.now()}`,
                date: getTodayStr(),
                status: updates.status,
                notes: `Status updated to ${updates.status}`,
              },
              ...timeline,
            ];
          }
          return { ...j, ...updates, status: newStatus, timeline };
        }
        return j;
      }),
    }));
  };

  const deleteJobApplication = (id: string) => {
    setData((prev) => ({
      ...prev,
      jobApplications: prev.jobApplications.filter((j) => j.id !== id),
    }));
  };

  const addJobTimelineUpdate = (jobId: string, update: Partial<JobTimelineUpdate>) => {
    const newUpdate: JobTimelineUpdate = {
      id: `tl_${Date.now()}`,
      date: update.date || getTodayStr(),
      status: update.status,
      notes: update.notes,
      link: update.link,
    };
    setData((prev) => ({
      ...prev,
      jobApplications: prev.jobApplications.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: update.status || j.status,
            timeline: [newUpdate, ...(j.timeline || [])],
          };
        }
        return j;
      }),
    }));
  };

  const updateJobTargets = (targets: Partial<JobTargets>) => {
    setData((prev) => ({
      ...prev,
      jobTargets: { ...prev.jobTargets, ...targets },
    }));
  };

  // --- GOAL HANDLERS ---
  const addGoal = (goal: Partial<Goal>) => {
    const newGoal: Goal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      startDate: goal.startDate || getTodayStr(),
      frequency: goal.frequency || 'Daily',
      logs: {},
      ...goal,
    };
    setData((prev) => ({
      ...prev,
      goals: [newGoal, ...prev.goals],
    }));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  };

  const deleteGoal = (id: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  const logGoalProgress = (goalId: string, dateStr: string, log: DailyGoalLog) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id === goalId) {
          const updatedLogs = {
            ...(g.logs || {}),
            [dateStr]: { ...log, date: dateStr },
          };
          return { ...g, logs: updatedLogs };
        }
        return g;
      }),
    }));
  };

  // --- SKILL HANDLERS ---
  const addSkill = (skill: Partial<Skill>) => {
    const newSkill: Skill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      startDate: skill.startDate || getTodayStr(),
      currentLevel: skill.currentLevel || 'Beginner',
      status: skill.status || 'Learning',
      logs: [],
      ...skill,
    };
    setData((prev) => ({
      ...prev,
      skills: [newSkill, ...prev.skills],
    }));
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const deleteSkill = (id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const logSkillLearning = (skillId: string, log: SkillLog) => {
    const newLog: SkillLog = {
      id: `skill_log_${Date.now()}`,
      date: log.date || getTodayStr(),
      hours: log.hours || 0,
      minutes: log.minutes || 0,
      topicLearned: log.topicLearned,
      notes: log.notes,
      resourceLink: log.resourceLink,
    };
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => {
        if (s.id === skillId) {
          return {
            ...s,
            logs: [newLog, ...(s.logs || [])],
          };
        }
        return s;
      }),
    }));
  };

  // --- SETTINGS & EXPORT/IMPORT ---
  const updateSettings = (settings: Partial<SettingsState>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  };

  const exportData = () => {
    exportDataAsJSON(data);
  };

  const importData = (imported: AppData) => {
    setData(imported);
  };

  const resetAllData = async () => {
    await clearAllAppData();
    setData(initialAppData);
  };

  return (
    <AppContext.Provider
      value={{
        data,
        isLoading,
        activeSection,
        setActiveSection,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        quickActionModalOpen,
        setQuickActionModalOpen,
        activeModalType,
        openModal,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodoComplete,
        addJobApplication,
        updateJobApplication,
        deleteJobApplication,
        addJobTimelineUpdate,
        updateJobTargets,
        addGoal,
        updateGoal,
        deleteGoal,
        logGoalProgress,
        addSkill,
        updateSkill,
        deleteSkill,
        logSkillLearning,
        updateSettings,
        exportData,
        importData,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
