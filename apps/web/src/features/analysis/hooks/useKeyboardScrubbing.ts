import { useEffect } from 'react';
import { useAnalysisStore } from '../store/analysisStore';

export function useKeyboardScrubbing() {
  const { currentPly, scrubPly, setScrubPly } = useAnalysisStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const active = scrubPly ?? currentPly;
        if (active > 0) {
          setScrubPly(active - 1);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const active = scrubPly ?? currentPly;
        if (active < currentPly) {
          setScrubPly(active + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPly, scrubPly, setScrubPly]);
}
