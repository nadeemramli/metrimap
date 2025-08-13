// Re-export stores from their new locations in features and shared
export { useCanvasStore } from '@/features/canvas/stores/canvasStore';
export { useEdgeStore } from '@/features/canvas/stores/useEdgeStore';
export { useGroupStore } from '@/features/canvas/stores/useGroupStore';
export { useNodeStore } from '@/features/canvas/stores/useNodeStore';

// Shared stores
export { useAppStore } from '@/shared/stores/useAppStore';
export { useTagStore } from '@/shared/stores/useTagStore';

// Feature stores
export { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
export { useProjectsStore } from '@/features/projects/stores/useProjectsStore';
export { useSourcesStore } from '@/features/sources/stores/useSourcesStore';

// Version history store
export { useVersionHistoryStore } from './version-history/useVersionHistoryStore';

// Auto save store
export { useAutoSaveStore } from './autosave/useAutoSaveStore';
