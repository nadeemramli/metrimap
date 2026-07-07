import { useEffect } from 'react';
import { startCanvasTour } from './tour';
import { useOnboardingStore } from './useOnboardingStore';

/**
 * Mounted by CanvasPage: when a tour is pending (the welcome flow just copied
 * the demo canvas), wait for the canvas to settle, then launch the guided
 * tour once. `ready` should flip true when nodes are actually rendered.
 */
export function CanvasTourLauncher({ ready }: { ready: boolean }) {
  const tourPending = useOnboardingStore((s) => s.tourPending);

  useEffect(() => {
    if (!tourPending || !ready) return;
    // Let fitView + node measurement settle before spotlighting.
    const timer = setTimeout(() => {
      useOnboardingStore.getState().setTourPending(false);
      startCanvasTour();
    }, 1200);
    return () => clearTimeout(timer);
  }, [tourPending, ready]);

  return null;
}
