import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { useCanvasEvents } from './useCanvasEvents';

// Regression guard for the /canvas/:id React #185 ("max update depth") loop:
// useCanvasEvents must return referentially STABLE handlers even though its
// `state` prop (from useCanvasPageState) is a brand-new object every render.
// If the handlers churn, the CanvasPage `edges`/`nodes` memos that depend on
// them rebuild every render and feed React Flow new props → infinite loop.
describe('useCanvasEvents', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ReactFlowProvider>{children}</ReactFlowProvider>
  );
  const makeOpts = () => ({
    state: {} as any,
    canvasMachine: {} as any,
    viewportSync: { updateViewport: () => {} },
    onApplyLayout: () => {},
  });

  it('keeps a stable object + handler identities across state-object churn', () => {
    const { result, rerender } = renderHook((p) => useCanvasEvents(p), {
      initialProps: makeOpts(),
      wrapper,
    });
    const first = result.current;

    // Re-render with a brand-new options/state object (mimics every render).
    rerender(makeOpts());

    expect(result.current).toBe(first);
    expect(result.current.handleOpenRelationshipSheet).toBe(
      first.handleOpenRelationshipSheet
    );
    expect(result.current.handleSwitchToRelationship).toBe(
      first.handleSwitchToRelationship
    );
    expect(result.current.handleOpenSettingsSheet).toBe(
      first.handleOpenSettingsSheet
    );
  });
});
