import { useEffect, useState, useRef, useCallback } from 'react';
import { TimerPhase, TimerSettings } from '../types';

interface UseTimerLogicProps {
  settings: TimerSettings;
  onPhaseComplete: () => void;
}

export const useTimerLogic = ({ settings, onPhaseComplete }: UseTimerLogicProps) => {
  const [phase, setPhase] = useState<TimerPhase>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const backgroundStartTime = useRef<number | null>(null);

  useEffect(() => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      const { phase: savedPhase, timeLeft: savedTime, sessionsCompleted: savedSessions } = JSON.parse(savedState);
      const lastSaved = JSON.parse(localStorage.getItem('timerStateSaved') || '0');
      const elapsed = Math.floor((Date.now() - lastSaved) / 1000);
      setPhase(savedPhase);
      setSessionsCompleted(savedSessions);
      setTimeLeft(Math.max(0, savedTime - elapsed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify({ phase, timeLeft, sessionsCompleted }));
    localStorage.setItem('timerStateSaved', JSON.stringify(Date.now()));
  }, [phase, timeLeft, sessionsCompleted]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let lastTickTime = Date.now();

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - lastTickTime) / 1000);
        lastTickTime = now;

        setTimeLeft((prev) => {
          const newTime = prev - elapsed;
          if (newTime <= 0) {
            setIsRunning(false);
            onPhaseComplete();
            return 0;
          }
          return newTime;
        });
      }, 100);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, onPhaseComplete]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isRunning) {
          backgroundStartTime.current = Date.now();
        }
      } else {
        if (isRunning && backgroundStartTime.current) {
          const elapsed = Math.floor((Date.now() - backgroundStartTime.current) / 1000);
          setTimeLeft((prev) => Math.max(0, prev - elapsed));
          backgroundStartTime.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning]);

  const getDurationForPhase = (timerPhase: TimerPhase): number => {
    switch (timerPhase) {
      case 'work':
        return settings.workDuration * 60;
      case 'shortBreak5':
        return 5 * 60;
      case 'shortBreak10':
        return 10 * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
    }
  };

  const switchPhase = useCallback((newPhase: TimerPhase) => {
    setIsRunning(false);
    setPhase(newPhase);
    setTimeLeft(getDurationForPhase(newPhase));
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(getDurationForPhase(phase));
  }, [phase]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const skipToNext = useCallback(() => {
    setIsRunning(false);
    onPhaseComplete();
  }, [onPhaseComplete]);

  return { phase, setPhase, timeLeft, setTimeLeft, isRunning, setIsRunning, sessionsCompleted, setSessionsCompleted, switchPhase, resetTimer, toggleTimer, skipToNext, getDurationForPhase };
};