import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const confirmMock = vi.fn();
const deleteProjectStoreMock = vi.fn();

vi.mock('@/shared/components/ConfirmDialog', () => ({
  useConfirm: () => confirmMock,
}));

vi.mock('@/features/projects/stores/useProjectsStore', () => ({
  useProjectsStore: () => ({
    addProject: vi.fn(),
    deleteProject: deleteProjectStoreMock,
    duplicateProject: vi.fn(),
    setStarred: vi.fn(),
    setArchived: vi.fn(),
    getProjectById: vi.fn(),
  }),
}));

vi.mock('@/lib/stores', () => ({
  useAppStore: { getState: () => ({ user: null }) },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { useProjectActions } from './useProjectActions';

describe('useProjectActions deleteProject confirm gate', () => {
  beforeEach(() => {
    confirmMock.mockReset();
    deleteProjectStoreMock.mockReset();
  });

  it('does not delete when the confirm dialog is cancelled', async () => {
    confirmMock.mockResolvedValue(false);
    const { result } = renderHook(() => useProjectActions());

    await result.current.deleteProject('project-1');

    expect(confirmMock).toHaveBeenCalledTimes(1);
    expect(confirmMock).toHaveBeenCalledWith(
      expect.objectContaining({ destructive: true })
    );
    expect(deleteProjectStoreMock).not.toHaveBeenCalled();
  });

  it('deletes when the confirm dialog is accepted', async () => {
    confirmMock.mockResolvedValue(true);
    deleteProjectStoreMock.mockResolvedValue(undefined);
    const { result } = renderHook(() => useProjectActions());

    await result.current.deleteProject('project-1');

    expect(deleteProjectStoreMock).toHaveBeenCalledWith('project-1');
  });

  it('handleDeleteProject also passes through the confirm gate', async () => {
    confirmMock.mockResolvedValue(false);
    const { result } = renderHook(() => useProjectActions());

    await result.current.handleDeleteProject('project-2');

    expect(deleteProjectStoreMock).not.toHaveBeenCalled();
  });
});
