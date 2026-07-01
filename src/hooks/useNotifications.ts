import { useEffect, useCallback } from 'react';
import { TimerPhase } from '../types';

export const useNotifications = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, [enabled]);

  const notifyCompletion = useCallback((phase: TimerPhase, nextPhase: string) => {
    if (!enabled) return;

    const messages: Record<TimerPhase, string> = {
      work: `Study session complete! Time for a ${nextPhase} break.`,
      shortBreak5: 'Break time is over! Ready to study?',
      shortBreak10: 'Break time is over! Ready to study?',
      longBreak: 'Long break complete! You earned it. Ready for more?',
    };

    try {
      playSound(phase);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Revision Timer', { body: messages[phase], icon: '⏰' });
      }
    } catch (e) {
      console.error('Notification error:', e);
    }
  }, [enabled]);

  return { notifyCompletion };
};

const playSound = (phase: TimerPhase) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const frequencies = phase === 'work' ? [800, 600] : [1000];
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      const startTime = audioContext.currentTime + index * 0.3;
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    });
  } catch (e) {
    console.error('Audio error:', e);
  }
};