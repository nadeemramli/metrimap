// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { tracked_metricsOrderByWithRelationInputObjectSchema } from './tracked_metricsOrderByWithRelationInput.schema'

export const metric_valuesOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.metric_valuesOrderByWithRelationInput, Prisma.metric_valuesOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  period: SortOrderSchema.optional(),
  value: SortOrderSchema.optional(),
  change_percent: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  trend: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const metric_valuesOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  period: SortOrderSchema.optional(),
  value: SortOrderSchema.optional(),
  change_percent: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  trend: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsOrderByWithRelationInputObjectSchema).optional()
}).strict();
