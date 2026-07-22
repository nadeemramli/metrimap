// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { tracked_metricsOrderByWithRelationInputObjectSchema } from './tracked_metricsOrderByWithRelationInput.schema';
import { event_propertiesOrderByRelationAggregateInputObjectSchema } from './event_propertiesOrderByRelationAggregateInput.schema'

export const event_definitionsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.event_definitionsOrderByWithRelationInput, Prisma.event_definitionsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lifecycle_state: SortOrderSchema.optional(),
  source_kind: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  owner_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tracked_metric_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  tracked_metrics: z.lazy(() => tracked_metricsOrderByWithRelationInputObjectSchema).optional(),
  event_properties: z.lazy(() => event_propertiesOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const event_definitionsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lifecycle_state: SortOrderSchema.optional(),
  source_kind: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  owner_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tracked_metric_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  tracked_metrics: z.lazy(() => tracked_metricsOrderByWithRelationInputObjectSchema).optional(),
  event_properties: z.lazy(() => event_propertiesOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
