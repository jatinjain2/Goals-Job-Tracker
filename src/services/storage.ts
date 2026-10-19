import { get, set, del } from 'idb-keyval';
import type { AppData } from '../types';

const STORAGE_KEY = 'PERSONAL_PRODUCTIVITY_APP_DATA_V1';

export const initialAppData: AppData = {
  todos: [],
  jobApplications: [],
  jobTargets: {
    dailyTarget: 5,
    monthlyTarget: 100,
  },
  goals: [],
  skills: [],
  settings: {
    theme: 'dark',
    defaultTodoView: 'list',
    dateFormat: 'YYYY-MM-DD',
  },
};

export async function loadAppData(): Promise<AppData> {
  try {
    const data = await get<AppData>(STORAGE_KEY);
    if (data) {
      return {
        ...initialAppData,
        ...data,
        jobTargets: { ...initialAppData.jobTargets, ...(data.jobTargets || {}) },
        settings: { ...initialAppData.settings, ...(data.settings || {}) },
      };
    }
  } catch (err) {
    console.warn('IndexedDB read failed, trying localStorage:', err);
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...initialAppData,
        ...parsed,
        jobTargets: { ...initialAppData.jobTargets, ...(parsed.jobTargets || {}) },
        settings: { ...initialAppData.settings, ...(parsed.settings || {}) },
      };
    }
  } catch (err) {
    console.error('LocalStorage read failed:', err);
  }

  return initialAppData;
}

export async function saveAppData(data: AppData): Promise<void> {
  try {
    await set(STORAGE_KEY, data);
  } catch (err) {
    console.warn('IndexedDB write failed, falling back to localStorage:', err);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write failed:', err);
  }
}

export async function clearAllAppData(): Promise<void> {
  try {
    await del(STORAGE_KEY);
  } catch (e) {
    console.warn('IndexedDB delete failed:', e);
  }
  localStorage.removeItem(STORAGE_KEY);
}

export function exportDataAsJSON(data: AppData) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `productivity_dashboard_backup_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseImportJSON(fileContent: string): AppData | null {
  try {
    const parsed = JSON.parse(fileContent);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        todos: Array.isArray(parsed.todos) ? parsed.todos : [],
        jobApplications: Array.isArray(parsed.jobApplications) ? parsed.jobApplications : [],
        jobTargets: {
          dailyTarget: Number(parsed.jobTargets?.dailyTarget) || 5,
          monthlyTarget: Number(parsed.jobTargets?.monthlyTarget) || 100,
        },
        goals: Array.isArray(parsed.goals) ? parsed.goals : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        settings: {
          theme: parsed.settings?.theme === 'light' ? 'light' : 'dark',
          defaultTodoView: parsed.settings?.defaultTodoView === 'compact' ? 'compact' : 'list',
          dateFormat: parsed.settings?.dateFormat || 'YYYY-MM-DD',
        },
      };
    }
  } catch (err) {
    console.error('Failed to parse import JSON', err);
  }
  return null;
}
