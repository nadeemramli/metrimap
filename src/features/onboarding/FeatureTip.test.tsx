import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { FeatureTipCard, fireTipToast } from './FeatureTip';
import { useOnboardingStore } from './useOnboardingStore';

describe('FeatureTipCard', () => {
  beforeEach(() => {
    localStorage.clear();
    useOnboardingStore.setState({ dismissedTips: {} });
  });

  it('shows until dismissed, then never again', () => {
    const { rerender } = render(
      <FeatureTipCard id="test-tip">Hello tip</FeatureTipCard>
    );
    expect(screen.getByText('Hello tip')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Dismiss tip'));
    expect(screen.queryByText('Hello tip')).not.toBeInTheDocument();

    // Fresh mount still hidden — dismissal persisted in the store.
    rerender(<FeatureTipCard id="test-tip">Hello tip</FeatureTipCard>);
    expect(screen.queryByText('Hello tip')).not.toBeInTheDocument();
    expect(useOnboardingStore.getState().dismissedTips['test-tip']).toBe(true);
  });

  it('independent tips do not affect each other', () => {
    render(
      <>
        <FeatureTipCard id="tip-a">Tip A</FeatureTipCard>
        <FeatureTipCard id="tip-b">Tip B</FeatureTipCard>
      </>
    );
    fireEvent.click(screen.getAllByLabelText('Dismiss tip')[0]);
    expect(screen.queryByText('Tip A')).not.toBeInTheDocument();
    expect(screen.getByText('Tip B')).toBeInTheDocument();
  });
});

describe('fireTipToast', () => {
  beforeEach(() => useOnboardingStore.setState({ dismissedTips: {} }));

  it('marks the tip dismissed on first fire (one-shot)', () => {
    fireTipToast('toast-tip', 'msg');
    expect(useOnboardingStore.getState().dismissedTips['toast-tip']).toBe(true);
    // Second call is a no-op (already dismissed) — must not throw.
    fireTipToast('toast-tip', 'msg');
  });
});
