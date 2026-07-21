// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const alert_rulesCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.alert_rulesCountOrderByAggregateInput, Prisma.alert_rulesCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  card_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  rule_type: SortOrderSchema.optional(),
  config: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  last_triggered_at: SortOrderSchema.optional(),
  last_triggered_value: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const alert_rulesCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  card_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  rule_type: SortOrderSchema.optional(),
  config: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  last_triggered_at: SortOrderSchema.optional(),
  last_triggered_value: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
