// Zod input schemas for the programmatic Metrimap API (CVS-98). These define the
// stable, validated surface the MCP server (and the app) call — one place for
// input validation so agents get clear errors. Kept intentionally small/flat;
// the facade maps these to the existing domain services.
import { z } from 'zod';

export const CARD_CATEGORIES = [
  'Core/Value',
  'Data/Metric',
  'Work/Action',
  'Ideas/Hypothesis',
  'Metadata',
] as const;

export const RELATIONSHIP_TYPES = [
  'Deterministic',
  'Probabilistic',
  'Causal',
  'Compositional',
  'Exploratory',
] as const;

export const CONFIDENCE_LEVELS = ['High', 'Medium', 'Low'] as const;

export const EVIDENCE_TYPES = [
  'Experiment',
  'Analysis',
  'Notebook',
  'External Research',
  'User Interview',
] as const;

const zPosition = z.object({ x: z.number(), y: z.number() });

// --- Canvases (projects) ---
export const CreateCanvasInput = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  isPublic: z.boolean().optional(),
});

// Exported un-refined so the MCP tool schema can publish a flat shape
// (ZodEffects have no .shape).
export const UpdateCanvasFields = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  isPublic: z.boolean().optional(),
});

export const UpdateCanvasInput = UpdateCanvasFields.refine(
  (o) => Object.keys(o).length > 0,
  { message: 'Provide at least one field to update' }
);

// --- Nodes (metric_cards) ---
export const CreateNodeInput = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1).max(200),
  category: z.enum(CARD_CATEGORIES),
  // Category-specific role (e.g. 'Input Metric', 'North Star Metric'). Validated
  // loosely here; the DB accepts any string sub_category.
  subCategory: z.string().max(100).optional(),
  description: z.string().max(4000).optional(),
  position: zPosition.optional(),
  formula: z.string().max(2000).optional(),
  assignees: z.array(z.string()).max(50).optional(),
});

// Convenience inputs where the category is implied by the method.
export const CreateTypedNodeInput = CreateNodeInput.omit({ category: true });

// Exported un-refined so the MCP tool schema can publish a flat shape
// (ZodEffects have no .shape).
export const UpdateNodeFields = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(4000).optional(),
  category: z.enum(CARD_CATEGORIES).optional(),
  subCategory: z.string().max(100).optional(),
  formula: z.string().max(2000).optional(),
  position: zPosition.optional(),
  assignees: z.array(z.string()).max(50).optional(),
});

export const UpdateNodeInput = UpdateNodeFields.refine(
  (o) => Object.keys(o).length > 0,
  { message: 'Provide at least one field to update' }
);

// --- Relationships ---
export const CreateRelationshipInput = z.object({
  projectId: z.string().uuid(),
  sourceId: z.string().uuid(),
  targetId: z.string().uuid(),
  type: z.enum(RELATIONSHIP_TYPES),
  confidence: z.enum(CONFIDENCE_LEVELS).optional(),
  weight: z.number().min(0).max(1).optional(),
  notes: z.string().max(2000).optional(),
});

// Exported un-refined so the MCP tool schema can publish a flat shape
// (ZodEffects have no .shape).
export const UpdateRelationshipFields = z.object({
  type: z.enum(RELATIONSHIP_TYPES).optional(),
  confidence: z.enum(CONFIDENCE_LEVELS).optional(),
  weight: z.number().min(0).max(1).optional(),
  notes: z.string().max(2000).optional(),
});

export const UpdateRelationshipInput = UpdateRelationshipFields.refine(
  (o) => Object.keys(o).length > 0,
  { message: 'Provide at least one field to update' }
);

// --- Groups (canvas grouping — each group also drives a group dashboard) ---
const zSize = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

export const CreateGroupInput = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).max(200),
  nodeIds: z.array(z.string().uuid()).min(1).max(500),
  color: z.string().max(32).optional(),
  description: z.string().max(2000).optional(),
  // Omitted → computed from the members' current positions (same padding the
  // canvas uses), so create_group can run after layout_tree at any time.
  position: zPosition.optional(),
  size: zSize.optional(),
});

// Exported un-refined so the MCP tool schema can publish a flat shape
// (ZodEffects have no .shape).
export const UpdateGroupFields = z.object({
  name: z.string().min(1).max(200).optional(),
  nodeIds: z.array(z.string().uuid()).min(1).max(500).optional(),
  color: z.string().max(32).optional(),
  description: z.string().max(2000).optional(),
  position: zPosition.optional(),
  size: zSize.optional(),
  /** Re-fit position/size to the current member positions (post-layout). */
  refit: z.boolean().optional(),
});

export const UpdateGroupInput = UpdateGroupFields.refine(
  (o) => Object.keys(o).length > 0,
  { message: 'Provide at least one field to update' }
);

export const GroupMembershipInput = z.object({
  groupId: z.string().uuid(),
  nodeIds: z.array(z.string().uuid()).min(1).max(500),
});

// --- Evidence (attach to a card XOR a relationship) ---
export const CreateEvidenceInput = z
  .object({
    projectId: z.string().uuid(),
    cardId: z.string().uuid().optional(),
    relationshipId: z.string().uuid().optional(),
    title: z.string().min(1).max(200),
    type: z.enum(EVIDENCE_TYPES),
    summary: z.string().min(1).max(5000),
    /** ISO date 'YYYY-MM-DD'; defaults to today. */
    date: z.string().optional(),
    owner: z.string().max(200).optional(),
    hypothesis: z.string().max(2000).optional(),
    link: z.string().url().max(500).optional(),
    /** EditorJS notebook JSON (optional; passed through untouched). */
    content: z.unknown().optional(),
  })
  .refine(
    (v) => (v.cardId ? 1 : 0) + (v.relationshipId ? 1 : 0) <= 1,
    { message: 'Provide at most one of cardId or relationshipId (neither = general project evidence).' }
  );

export const ListEvidenceInput = z.object({
  projectId: z.string().uuid(),
  /** When set, only evidence attached to this card. */
  cardId: z.string().uuid().optional(),
});

// Exported un-refined so the MCP tool schema can publish a flat shape
// (ZodEffects have no .shape).
export const UpdateEvidenceFields = z.object({
  title: z.string().min(1).max(200).optional(),
  type: z.enum(EVIDENCE_TYPES).optional(),
  summary: z.string().min(1).max(5000).optional(),
  date: z.string().optional(),
  owner: z.string().max(200).optional(),
  hypothesis: z.string().max(2000).optional(),
  link: z.string().url().max(500).optional(),
  content: z.unknown().optional(),
});

export const UpdateEvidenceInput = UpdateEvidenceFields.refine(
  (o) => Object.keys(o).length > 0,
  { message: 'Provide at least one field to update' }
);

// --- Tags ---
export const CreateTagInput = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).max(100),
  color: z.string().max(32).optional(),
  description: z.string().max(500).optional(),
});

export const TagCardInput = z.object({
  cardId: z.string().uuid(),
  /** Tag NAMES (must already exist on the project — see create_tag). */
  tags: z.array(z.string().min(1).max(100)).min(1).max(20),
});

// --- Tracked-metric catalog ---
export const PromoteCardInput = z.object({
  cardId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  unit: z.string().max(50).optional(),
  formula: z.string().max(2000).optional(),
  ownerLabel: z.string().max(200).optional(),
  sourceKind: z.string().max(100).optional(),
});

export const GetMetricValuesInput = z.object({
  trackedMetricId: z.string().uuid(),
});

// --- Comments ---
export const CreateCommentInput = z.object({
  projectId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  /** Pin the new thread to a card (ignored when replying via threadId). */
  cardId: z.string().uuid().optional(),
  /** Reply into an existing thread instead of starting a new one. */
  threadId: z.string().uuid().optional(),
});

// --- Values (tracked-metric series) ---
export const MetricValueInput = z.object({
  period: z.string().min(1),
  value: z.number(),
  change_percent: z.number().optional(),
  trend: z.enum(['up', 'down', 'neutral']).optional(),
});

export const PushValuesInput = z.object({
  trackedMetricId: z.string().uuid(),
  series: z.array(MetricValueInput).min(1).max(1000),
  source: z.string().max(200).optional(),
});

// --- Layout ---
export const LAYOUT_DIRECTIONS = ['TB', 'BT', 'LR', 'RL'] as const;
export const LayoutTreeInput = z.object({
  projectId: z.string().uuid(),
  direction: z.enum(LAYOUT_DIRECTIONS).optional(),
});

// --- Data ingest (staging → materialize) ---
export const StageSeriesInput = z.object({
  projectId: z.string().uuid(),
  series: z.array(MetricValueInput).min(1).max(5000),
});

export const UploadCsvInput = z.object({
  projectId: z.string().uuid(),
  filename: z.string().max(200).optional(),
  csv: z.string().min(1).max(1_000_000), // ~1MB payload cap
});

export const MaterializeInput = z.object({
  batchId: z.string().uuid(),
  mapping: z.object({
    cardId: z.string().uuid(),
    // Required for CSV batches; ignored for series batches (already period/value).
    periodColumn: z.string().max(200).optional(),
    valueColumn: z.string().max(200).optional(),
  }),
});

export type CreateCanvasInputT = z.infer<typeof CreateCanvasInput>;
export type UpdateCanvasInputT = z.infer<typeof UpdateCanvasInput>;
export type CreateNodeInputT = z.infer<typeof CreateNodeInput>;
export type CreateTypedNodeInputT = z.infer<typeof CreateTypedNodeInput>;
export type UpdateNodeInputT = z.infer<typeof UpdateNodeInput>;
export type CreateRelationshipInputT = z.infer<typeof CreateRelationshipInput>;
export type CreateEvidenceInputT = z.infer<typeof CreateEvidenceInput>;
export type PushValuesInputT = z.infer<typeof PushValuesInput>;
export type LayoutTreeInputT = z.infer<typeof LayoutTreeInput>;
export type StageSeriesInputT = z.infer<typeof StageSeriesInput>;
export type UploadCsvInputT = z.infer<typeof UploadCsvInput>;
export type MaterializeInputT = z.infer<typeof MaterializeInput>;
