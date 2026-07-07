import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import './tour.css';
import { useOnboardingStore } from './useOnboardingStore';

// The guided canvas tour (CVS-114 slice 2). Runs on the user's own copy of the
// demo canvas so every step points at real, populated content. Anchors are
// stable data-tour attributes; steps missing from the DOM are skipped by
// driver.js, so the tour degrades gracefully if a surface is hidden.

const steps: DriveStep[] = [
  {
    element: '[data-tour="canvas-pane"]',
    popover: {
      title: 'This is a metric tree',
      description:
        'Your business as a living map: an objective (MRR), the metrics that drive it, and the work meant to move them. Drag to pan, scroll to zoom.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '.react-flow__node',
    popover: {
      title: 'Cards are your building blocks',
      description:
        'Metrics carry real values and trends; actions and hypotheses carry owners and status. Double-click any card to open its detail panel.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="canvas-toolbar"]',
    popover: {
      title: 'Build from the toolbar',
      description:
        'Add cards, draw connections, sketch in draw mode, and auto-layout the tree from here.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="layers-toggle"]',
    popover: {
      title: 'Layers — your Figma-style overview',
      description:
        'Every node, drawing, and group in one panel: select, rename, hide, lock, and reorder. Press [ anytime.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="rail-strategy"]',
    popover: {
      title: 'The same work, as a board',
      description:
        'Strategy shows your actions and hypotheses as a kanban with impact contracts — what should move, by how much, and by when.',
      side: 'right',
    },
  },
  {
    element: '[data-tour="rail-dashboard"]',
    popover: {
      title: 'Dashboards derive themselves',
      description:
        'Every group on the canvas gets a live dashboard automatically — plus custom widgets you can move between them. Head there next.',
      side: 'right',
    },
  },
];

/** Start the canvas tour. Marks completed/skipped in the onboarding store. */
export function startCanvasTour() {
  const store = useOnboardingStore.getState();
  let finished = false;

  const tour = driver({
    steps,
    popoverClass: 'metrimap-tour',
    // No continuous animation: deterministic positioning over the canvas
    // (React Flow transforms otherwise keep the popover perpetually settling).
    animate: false,
    showProgress: true,
    overlayOpacity: 0.55,
    stagePadding: 6,
    stageRadius: 10,
    nextBtnText: 'Next',
    prevBtnText: 'Back',
    doneBtnText: 'Done',
    onDestroyStarted: () => {
      finished = !tour.hasNextStep();
      tour.destroy();
    },
    onDestroyed: () => {
      if (finished) store.markTourCompleted();
      else store.markTourSkipped();
    },
  });

  tour.drive();
}
