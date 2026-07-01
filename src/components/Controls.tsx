import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { TimerPhase } from '../types';

interface ControlsProps {
  isRunning: boolean;
  onPlay: () => void;
  onReset: () => void;
  onSkip: () => void;
  phase: TimerPhase;
  onPhaseChange: (phase: TimerPhase) => void;
}

export default function Controls({ isRunning, onPlay, onReset, onSkip, phase, onPhaseChange }: ControlsProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center flex-wrap">
        <button onClick={onPlay} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-5 transition-all transform hover:scale-110 active:scale-95" title="Play/Pause (Space)">
          {isRunning ? <Pause size={28} /> : <Play size={28} />}
        </button>
        <button onClick={onReset} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-5 transition-all transform hover:scale-110 active:scale-95" title="Reset (R)">
          <RotateCcw size={28} />
        </button>
        <button onClick={onSkip} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-5 transition-all transform hover:scale-110 active:scale-95" title="Skip (S)">
          <SkipForward size={28} />
        </button>
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        {[
          { id: 'work', label: '📖 Study', color: 'from-red-400 to-orange-400' },
          { id: 'shortBreak5', label: '☕ 5 min', color: 'from-blue-400 to-cyan-400' },
          { id: 'shortBreak10', label: '☕ 10 min', color: 'from-blue-400 to-cyan-400' },
          { id: 'longBreak', label: '🎉 Long', color: 'from-green-400 to-emerald-400' },
        ].map(({ id, label, color }) => (
          <button key={id} onClick={() => onPhaseChange(id as TimerPhase)} className={`px-4 py-2 rounded-lg text-white font-semibold transition-all text-sm ${phase === id ? `bg-gradient-to-r ${color} shadow-lg` : 'bg-white bg-opacity-10 hover:bg-opacity-20'}`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}