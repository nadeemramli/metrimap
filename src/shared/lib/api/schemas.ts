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

export const UpdateCanvasInput = z
  .object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    isPublic: z.boolean().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, {
    message: 'Provide at least one field to update',
  });

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

export const UpdateNodeInput = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(4000).optional(),
    category: z.enum(CARD_CATEGORIES).optional(),
    formula: z.string().max(2000).optional(),
    position: zPosition.optional(),
  })
  .refine((o) => Object.keys(o).length > 0, {
    message: 'Provide at least one field to update',
  });

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
    (v) => (v.cardId ? 1 : 0) + (v.relationshipId ? 1 : 0) === 1,
    { message: 'Provide exactly one of cardId or relationshipId.' }
  );

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

export type CreateCanvasInputT = z.infer<typeof CreateCanvasInput>;
export type UpdateCanvasInputT = z.infer<typeof UpdateCanvasInput>;
export type CreateNodeInputT = z.infer<typeof CreateNodeInput>;
export type CreateTypedNodeInputT = z.infer<typeof CreateTypedNodeInput>;
export type UpdateNodeInputT = z.infer<typeof UpdateNodeInput>;
export type CreateRelationshipInputT = z.infer<typeof CreateRelationshipInput>;
export type CreateEvidenceInputT = z.infer<typeof CreateEvidenceInput>;
export type PushValuesInputT = z.infer<typeof PushValuesInput>;
export type LayoutTreeInputT = z.infer<typeof LayoutTreeInput>;
