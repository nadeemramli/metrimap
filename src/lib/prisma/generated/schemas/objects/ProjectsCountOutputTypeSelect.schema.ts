// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const ProjectsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ProjectsCountOutputTypeSelect, Prisma.ProjectsCountOutputTypeSelect> = z.object({
  alert_rules: z.boolean().optional(),
  canvas_nodes: z.boolean().optional(),
  canvas_snapshots: z.boolean().optional(),
  changelog: z.boolean().optional(),
  comment_threads: z.boolean().optional(),
  dashboard_widgets: z.boolean().optional(),
  evidence_items: z.boolean().optional(),
  groups: z.boolean().optional(),
  metric_cards: z.boolean().optional(),
  project_collaborators: z.boolean().optional(),
  relationship_history: z.boolean().optional(),
  relationships: z.boolean().optional(),
  strategy_impact_contracts: z.boolean().optional(),
  tag_records: z.boolean().optional()
}).strict();
export const ProjectsCountOutputTypeSelectObjectZodSchema = z.object({
  alert_rules: z.boolean().optional(),
  canvas_nodes: z.boolean().optional(),
  canvas_snapshots: z.boolean().optional(),
  changelog: z.boolean().optional(),
  comment_threads: z.boolean().optional(),
  dashboard_widgets: z.boolean().optional(),
  evidence_items: z.boolean().optional(),
  groups: z.boolean().optional(),
  metric_cards: z.boolean().optional(),
  project_collaborators: z.boolean().optional(),
  relationship_history: z.boolean().optional(),
  relationships: z.boolean().optional(),
  strategy_impact_contracts: z.boolean().optional(),
  tag_records: z.boolean().optional()
}).strict();
