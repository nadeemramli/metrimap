// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { metric_cardsOrderByWithRelationInputObjectSchema } from './metric_cardsOrderByWithRelationInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema'

export const alert_rulesOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.alert_rulesOrderByWithRelationInput, Prisma.alert_rulesOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  card_id: SortOrderSchema.optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  rule_type: SortOrderSchema.optional(),
  config: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  last_triggered_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_triggered_value: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const alert_rulesOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  card_id: SortOrderSchema.optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  rule_type: SortOrderSchema.optional(),
  config: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  last_triggered_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_triggered_value: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional()
}).strict();
