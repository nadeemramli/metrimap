// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { alert_rulesCountOrderByAggregateInputObjectSchema } from './alert_rulesCountOrderByAggregateInput.schema';
import { alert_rulesAvgOrderByAggregateInputObjectSchema } from './alert_rulesAvgOrderByAggregateInput.schema';
import { alert_rulesMaxOrderByAggregateInputObjectSchema } from './alert_rulesMaxOrderByAggregateInput.schema';
import { alert_rulesMinOrderByAggregateInputObjectSchema } from './alert_rulesMinOrderByAggregateInput.schema';
import { alert_rulesSumOrderByAggregateInputObjectSchema } from './alert_rulesSumOrderByAggregateInput.schema'

export const alert_rulesOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.alert_rulesOrderByWithAggregationInput, Prisma.alert_rulesOrderByWithAggregationInput> = z.object({
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
  _count: z.lazy(() => alert_rulesCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => alert_rulesAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => alert_rulesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => alert_rulesMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => alert_rulesSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const alert_rulesOrderByWithAggregationInputObjectZodSchema = z.object({
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
  _count: z.lazy(() => alert_rulesCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => alert_rulesAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => alert_rulesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => alert_rulesMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => alert_rulesSumOrderByAggregateInputObjectSchema).optional()
}).strict();
