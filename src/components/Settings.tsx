import React from 'react';
import { TimerSettings } from '../types';

interface SettingsProps {
  settings: TimerSettings;
  onSettingsChange: (settings: Partial<TimerSettings>) => void;
}

export default function Settings({ settings, onSettingsChange }: SettingsProps) {
  return (
    <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-6 mb-6 border border-gray-700 space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">⚙️ Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Study Duration: {settings.workDuration} min</label>
          <input type="range" min="1" max="60" value={settings.workDuration} onChange={(e) => onSettingsChange({ workDuration: parseInt(e.target.value) })} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Long Break: {settings.longBreakDuration} min</label>
          <input type="range" min="5" max="60" value={settings.longBreakDuration} onChange={(e) => onSettingsChange({ longBreakDuration: parseInt(e.target.value) })} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Short Break Duration</label>
          <div className="flex gap-2">
            <button onClick={() => onSettingsChange({ shortBreakDuration: 5 })} className={`flex-1 py-2 rounded ${settings.shortBreakDuration === 5 ? 'bg-blue-600' : 'bg-gray-700'} text-white`}>5 min</button>
            <button onClick={() => onSettingsChange({ shortBreakDuration: 10 })} className={`flex-1 py-2 rounded ${settings.shortBreakDuration === 10 ? 'bg-blue-600' : 'bg-gray-700'} text-white`}>10 min</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Sessions Until Long: {settings.sessionsUntilLongBreak}</label>
          <input type="range" min="2" max="10" value={settings.sessionsUntilLongBreak} onChange={(e) => onSettingsChange({ sessionsUntilLongBreak: parseInt(e.target.value) })} className="w-full" />
        </div>
      </div>
      <div className="pt-4 border-t border-gray-600 space-y-2">
        {[
          { key: 'soundEnabled', label: '🔊 Sound' },
          { key: 'notificationsEnabled', label: '🔔 Notifications' },
          { key: 'focusMode', label: '🎯 Focus Mode' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center space-x-3 text-gray-200 cursor-pointer">
            <input type="checkbox" checked={settings[key as keyof TimerSettings] as boolean} onChange={(e) => onSettingsChange({ [key]: e.target.checked })} className="w-4 h-4" />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}