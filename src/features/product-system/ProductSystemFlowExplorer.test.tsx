import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductSystemFlowExplorer } from './ProductSystemFlowExplorer';

describe('ProductSystemFlowExplorer', () => {
  it('renders the first flow with numbered steps and its first step active', () => {
    render(<ProductSystemFlowExplorer />);
    // Flow tabs
    expect(
      screen.getByRole('tab', { name: 'Strategy → Impact' })
    ).toHaveAttribute('aria-selected', 'true');
    // Numbered step cards
    expect(screen.getAllByText('01').length).toBeGreaterThan(0);
    // First step's detail shows by default
    expect(screen.getByRole('heading', { name: 'Start from the outcome' })).toBeInTheDocument();
  });

  it('clicking a step updates the active detail', () => {
    render(<ProductSystemFlowExplorer />);
    fireEvent.click(screen.getByRole('button', { name: /Metric impact/ }));
    expect(
      screen.getByRole('heading', { name: 'Contract the expected impact' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Metric impact/ })
    ).toHaveAttribute('aria-current', 'step');
  });

  it('switching flows resets to that flow’s first step', () => {
    render(<ProductSystemFlowExplorer />);
    fireEvent.click(screen.getByRole('tab', { name: 'Instrumentation → Trust' }));
    expect(screen.getByRole('heading', { name: 'Wire the source' })).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Instrumentation → Trust' })
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('arrow keys move the active step', () => {
    render(<ProductSystemFlowExplorer />);
    const first = screen.getByRole('button', { name: /Objective/ });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(
      screen.getByRole('heading', { name: 'Decompose into pillars and problems' })
    ).toBeInTheDocument();
  });
});
