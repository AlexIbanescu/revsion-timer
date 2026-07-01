import React, { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, TrendingUp, Music } from 'lucide-react';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import SettingsPanel from './components/Settings';
import StatisticsComponent from './components/Statistics';
import { useTimerLogic } from './hooks/useTimerLogic';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNotifications } from './hooks/useNotifications';
import { useStatistics } from './hooks/useStatistics';
import { TimerSettings, Session, TimerPhase } from './types';
import { getRandomMessage } from './utils/motivationalMessages';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  notificationsEnabled: true,
  focusMode: false,
  theme: 'dark',
};

export default function App() {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem('timerSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('timerSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  const { stats, exportData } = useStatistics(sessions);
  const { notifyCompletion } = useNotifications(settings.notificationsEnabled);

  const timerLogic = useTimerLogic({
    settings,
    onPhaseComplete: () => {},
  });

  const handlePhaseComplete = useCallback(() => {
    const newSession: Session = {
      id: `${Date.now()}`,
      phase: timerLogic.phase,
      duration: timerLogic.getDurationForPhase(timerLogic.phase),
      completed: true,
      timestamp: Date.now(),
    };
    setSessions([...sessions, newSession]);

    const getNextPhase = (currentPhase: TimerPhase): TimerPhase => {
      if (currentPhase === 'work') {
        const isLongBreak = (timerLogic.sessionsCompleted + 1) % settings.sessionsUntilLongBreak === 0;
        return isLongBreak ? 'longBreak' : (settings.shortBreakDuration === 5 ? 'shortBreak5' : 'shortBreak10');
      }
      return 'work';
    };

    const nextPhase = getNextPhase(timerLogic.phase);
    timerLogic.setPhase(nextPhase);
    timerLogic.setTimeLeft(timerLogic.getDurationForPhase(nextPhase));

    if (timerLogic.phase === 'work') {
      timerLogic.setSessionsCompleted((prev) => prev + 1);
    }

    notifyCompletion(timerLogic.phase, nextPhase === 'work' ? 'study' : 'break');
  }, [timerLogic, sessions, settings, notifyCompletion]);

  useKeyboardShortcuts({
    onPlayPause: () => timerLogic.toggleTimer(),
    onReset: () => timerLogic.resetTimer(),
    onSkip: () => timerLogic.skipToNext(),
    onToggleSettings: () => setShowSettings(!showSettings),
  });

  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('timerSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    setMotivationalMessage(getRandomMessage(timerLogic.phase === 'work' ? 'studying' : timerLogic.phase === 'longBreak' ? 'longBreak' : 'breaking'));
  }, [timerLogic.phase]);

  const updateSettings = useCallback((newSettings: Partial<TimerSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const getGradientClass = (): string => {
    switch (timerLogic.phase) {
      case 'work':
        return 'from-red-500 to-orange-500';
      case 'shortBreak5':
      case 'shortBreak10':
        return 'from-blue-500 to-cyan-500';
      case 'longBreak':
        return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-gradient-to-br ${settings.theme === 'dark' ? 'from-gray-900 to-gray-800' : 'from-gray-100 to-gray-200'} flex items-center justify-center p-4`}>
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>📚 Revision Timer</h1>
          <div className="flex gap-3">
            <button onClick={() => setMusicPlaying(!musicPlaying)} className={`p-3 rounded-full transition-all ${musicPlaying ? 'bg-purple-500 text-white' : settings.theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'}`} title="Focus Music">
              <Music size={20} />
            </button>
            <button onClick={() => setShowStats(!showStats)} className={`p-3 rounded-full transition-all ${showStats ? 'bg-green-500 text-white' : settings.theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'}`} title="Statistics">
              <TrendingUp size={20} />
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className={`p-3 rounded-full transition-all ${showSettings ? 'bg-blue-500 text-white' : settings.theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'}`} title="Settings">
              <SettingsIcon size={20} />
            </button>
          </div>
        </div>
        {showStats && <StatisticsComponent stats={stats} onExport={exportData} />}
        <div className={`bg-gradient-to-br ${getGradientClass()} rounded-3xl shadow-2xl p-8 mb-6 transition-all duration-300`}>
          <TimerDisplay phase={timerLogic.phase} timeLeft={timerLogic.timeLeft} sessionsCompleted={timerLogic.sessionsCompleted} />
          <Controls isRunning={timerLogic.isRunning} onPlay={timerLogic.toggleTimer} onReset={timerLogic.resetTimer} onSkip={timerLogic.skipToNext} phase={timerLogic.phase} onPhaseChange={timerLogic.switchPhase} />
          <div className="mt-8 text-center">
            <p className="text-white text-sm opacity-90 italic">{motivationalMessage}</p>
          </div>
        </div>
        {showSettings && <SettingsPanel settings={settings} onSettingsChange={updateSettings} />}
        <div className={`text-center text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>Keyboard: <kbd>Space</kbd> Play • <kbd>R</kbd> Reset • <kbd>S</kbd> Skip • <kbd>Ctrl+,</kbd> Settings</p>
        </div>
      </div>
    </div>
  );
}