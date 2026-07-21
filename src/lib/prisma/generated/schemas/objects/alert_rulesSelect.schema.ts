// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema';
import { projectsArgsObjectSchema } from './projectsArgs.schema'

export const alert_rulesSelectObjectSchema: z.ZodType<Prisma.alert_rulesSelect, Prisma.alert_rulesSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  card_id: z.boolean().optional(),
  name: z.boolean().optional(),
  rule_type: z.boolean().optional(),
  config: z.boolean().optional(),
  enabled: z.boolean().optional(),
  created_by: z.boolean().optional(),
  last_triggered_at: z.boolean().optional(),
  last_triggered_value: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
export const alert_rulesSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  card_id: z.boolean().optional(),
  name: z.boolean().optional(),
  rule_type: z.boolean().optional(),
  config: z.boolean().optional(),
  enabled: z.boolean().optional(),
  created_by: z.boolean().optional(),
  last_triggered_at: z.boolean().optional(),
  last_triggered_value: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
