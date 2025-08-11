// Legacy combined canvas store
export { useCanvasStore as useCanvasStoreLegacy } from './canvasStore';

// New modular canvas stores
export { useAutoSaveStore } from './autosave/useAutoSaveStore';
export { useCanvasStore } from './canvas/useCanvasStore';
export { useEdgeStore } from './edges/useEdgeStore';
export { useGroupStore } from './groups/useGroupStore';
export { useNodeStore } from './nodes/useNodeStore';

// Other stores
export { useAppStore } from './appStore';
export { useEvidenceStore } from './evidenceStore';
export { useProjectsStore } from './projectsStore';
export { useTagStore } from './tagStore';

// Version history store
export { useVersionHistoryStore } from './version-history/useVersionHistoryStore';

// Sources store
export { useSourcesStore } from './sources/useSourcesStore';

// Utility exports
export { sliceMetricByDimensions } from './canvas/metricSlicing';
export type { MetricSliceOptions, SliceResult } from './canvas/metricSlicing';
