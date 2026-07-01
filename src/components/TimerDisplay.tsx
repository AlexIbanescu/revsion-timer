import React from 'react';
import { TimerPhase } from '../types';

interface TimerDisplayProps {
  phase: TimerPhase;
  timeLeft: number;
  sessionsCompleted: number;
}

export default function TimerDisplay({ phase, timeLeft, sessionsCompleted }: TimerDisplayProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseLabel = (): string => {
    switch (phase) {
      case 'work':
        return '📖 Study Session';
      case 'shortBreak5':
        return '☕ Short Break (5 min)';
      case 'shortBreak10':
        return '☕ Short Break (10 min)';
      case 'longBreak':
        return '🎉 Long Break';
    }
  };

  const isPulse = timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6 uppercase tracking-wider text-white">{getPhaseLabel()}</h2>
      <div className={`bg-black bg-opacity-20 rounded-3xl p-16 mb-8 backdrop-blur-sm ${isPulse ? 'animate-pulse' : ''}`}>
        <div className="text-9xl font-bold text-white font-mono tracking-tight drop-shadow-lg">{formatTime(timeLeft)}</div>
      </div>
      <div className="w-full bg-black bg-opacity-20 rounded-full h-2 mb-8 overflow-hidden">
        <div className="bg-white h-full transition-all duration-300 w-3/4" />
      </div>
      <div className="text-white">
        <span className="text-4xl font-bold">{sessionsCompleted}</span>
        <span className="text-lg opacity-75 ml-2">sessions completed</span>
      </div>
    </div>
  );
}