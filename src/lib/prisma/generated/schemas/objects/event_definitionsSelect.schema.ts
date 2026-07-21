// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsArgsObjectSchema } from './tracked_metricsArgs.schema';
import { Event_propertiesFindManySchema } from '../findManyevent_properties.schema';
import { event_definitionsCountOutputTypeArgsObjectSchema } from './event_definitionsCountOutputTypeArgs.schema'

export const event_definitionsSelectObjectSchema: z.ZodType<Prisma.event_definitionsSelect, Prisma.event_definitionsSelect> = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  name: z.boolean().optional(),
  key: z.boolean().optional(),
  category: z.boolean().optional(),
  description: z.boolean().optional(),
  lifecycle_state: z.boolean().optional(),
  source_kind: z.boolean().optional(),
  owner_label: z.boolean().optional(),
  tracked_metric_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional(),
  event_properties: z.union([z.boolean(), z.lazy(() => Event_propertiesFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => event_definitionsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const event_definitionsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  name: z.boolean().optional(),
  key: z.boolean().optional(),
  category: z.boolean().optional(),
  description: z.boolean().optional(),
  lifecycle_state: z.boolean().optional(),
  source_kind: z.boolean().optional(),
  owner_label: z.boolean().optional(),
  tracked_metric_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional(),
  event_properties: z.union([z.boolean(), z.lazy(() => Event_propertiesFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => event_definitionsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
