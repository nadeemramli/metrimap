import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CompactTabs,
  EmptyState,
  ErrorState,
  NodeCardShell,
  TagTokenInput,
} from './index';

function TagHarness({ initial = [] as string[], suggestions = [] as string[] }) {
  const [tags, setTags] = useState<string[]>(initial);
  return (
    <TagTokenInput value={tags} onChange={setTags} suggestions={suggestions} />
  );
}

describe('TagTokenInput', () => {
  it('adds a tag on Enter and removes it via the token button', () => {
    render(<TagHarness />);
    const input = screen.getByPlaceholderText('Add tag…');
    fireEvent.change(input, { target: { value: 'growth' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('growth')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Remove growth'));
    expect(screen.queryByText('growth')).not.toBeInTheDocument();
  });

  it('does not add duplicates', () => {
    render(<TagHarness initial={['a']} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getAllByText('a')).toHaveLength(1);
  });
});

describe('CompactTabs', () => {
  it('shows the first panel by default and switches on click', async () => {
    const user = userEvent.setup();
    render(
      <CompactTabs
        tabs={[
          { value: 'one', label: 'One', content: <p>First panel</p> },
          { value: 'two', label: 'Two', content: <p>Second panel</p> },
        ]}
      />
    );
    expect(screen.getByText('First panel')).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Two' }));
    expect(await screen.findByText('Second panel')).toBeVisible();
  });
});

describe('EmptyState / ErrorState', () => {
  it('renders an empty state with an action', () => {
    render(<EmptyState title="No widgets" action={<button>Add</button>} />);
    expect(screen.getByText('No widgets')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('calls onRetry from the error state', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe('NodeCardShell', () => {
  it('renders title, type badge, and footer', () => {
    render(
      <NodeCardShell title="Revenue" typeLabel="Metric" footer={<span>id-123</span>}>
        <p>body</p>
      </NodeCardShell>
    );
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Metric')).toBeInTheDocument();
    expect(screen.getByText('id-123')).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
  });
});
