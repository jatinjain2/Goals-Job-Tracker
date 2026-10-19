import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { parseImportJSON } from '../../services/storage';
import {
  Settings,
  Sun,
  Moon,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Database,
} from 'lucide-react';

export const SettingsSection: React.FC = () => {
  const { data, updateSettings, exportData, importData, resetAllData } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const parsed = parseImportJSON(content);
          if (parsed) {
            importData(parsed);
            setImportStatus('Data imported successfully! All records restored.');
          } else {
            setImportStatus('Failed to parse backup file. Please make sure it is a valid JSON file.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" /> App Settings & Data Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure your personal preferences, export backups, or manage local storage</p>
      </div>

      {/* Theme & Display Preferences */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          Display & Theme Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Selector */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200">Theme Mode</p>
              <p className="text-[11px] text-slate-400">Switch between dark & light mode</p>
            </div>
            <button
              onClick={() => updateSettings({ theme: data.settings.theme === 'dark' ? 'light' : 'dark' })}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition"
            >
              {data.settings.theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" /> Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" /> Light Mode
                </>
              )}
            </button>
          </div>

          {/* Default Todo View */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200">Default Todo View</p>
              <p className="text-[11px] text-slate-400">Choose preferred initial layout</p>
            </div>
            <select
              value={data.settings.defaultTodoView}
              onChange={(e) => updateSettings({ defaultTodoView: e.target.value as any })}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="list">Detailed View</option>
              <option value="compact">Compact View</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Backup, Export & Import */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" /> Local Data Storage & Backup
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            All your todos, job applications, consistency habits, and skills are stored locally inside your browser (IndexedDB).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-200">Export All Data</h3>
              <p className="text-[11px] text-slate-400">Download a complete JSON file backup of all your records.</p>
            </div>
            <button
              onClick={exportData}
              className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition"
            >
              <Download className="w-4 h-4" /> Download JSON Backup
            </button>
          </div>

          {/* Import */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-200">Import Data</h3>
              <p className="text-[11px] text-slate-400">Upload a JSON backup file to restore your saved data.</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <Upload className="w-4 h-4" /> Choose File to Import
            </button>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 bg-indigo-950/80 border border-indigo-800 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}
      </div>

      {/* Danger Zone / Clear Data */}
      <div className="bg-rose-950/20 border border-rose-800/80 p-6 rounded-2xl space-y-4">
        <div>
          <h2 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Danger Zone
          </h2>
          <p className="text-xs text-slate-400 mt-1">Permanently erase all stored todos, jobs, goals, and skills from your browser.</p>
        </div>

        {showClearConfirm ? (
          <div className="p-4 bg-rose-950 border border-rose-800 rounded-xl space-y-3">
            <p className="text-xs text-rose-200 font-semibold">
              Are you absolute sure you want to clear all data? This action cannot be undone unless you have a JSON backup file!
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  await resetAllData();
                  setShowClearConfirm(false);
                  alert('All data has been reset to empty initial state.');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Yes, Clear Everything
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-semibold border border-rose-800 flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" /> Clear All Data
          </button>
        )}
      </div>
    </div>
  );
};
