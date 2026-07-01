import { useEffect } from 'react';

interface KeyboardShortcutCallbacks {
  onPlayPause?: () => void;
  onReset?: () => void;
  onSkip?: () => void;
  onToggleSettings?: () => void;
}

export const useKeyboardShortcuts = (callbacks: KeyboardShortcutCallbacks) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.code === 'Space' && !isInput) {
        e.preventDefault();
        callbacks.onPlayPause?.();
      }

      if ((e.key === 'r' || e.key === 'R') && !isInput && !e.ctrlKey && !e.metaKey) {
        callbacks.onReset?.();
      }

      if ((e.key === 's' || e.key === 'S') && !isInput && !e.ctrlKey && !e.metaKey) {
        callbacks.onSkip?.();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        callbacks.onToggleSettings?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
};