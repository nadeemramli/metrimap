// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateNestedOneWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsCreateNestedOneWithoutEvent_definitionsInput.schema';
import { event_propertiesCreateNestedManyWithoutEvent_definitionsInputObjectSchema } from './event_propertiesCreateNestedManyWithoutEvent_definitionsInput.schema'

export const event_definitionsCreateInputObjectSchema: z.ZodType<Prisma.event_definitionsCreateInput, Prisma.event_definitionsCreateInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  key: z.string(),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lifecycle_state: z.string().optional(),
  source_kind: z.string().optional().nullable(),
  owner_label: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutEvent_definitionsInputObjectSchema).optional(),
  event_properties: z.lazy(() => event_propertiesCreateNestedManyWithoutEvent_definitionsInputObjectSchema).optional()
}).strict();
export const event_definitionsCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  key: z.string(),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lifecycle_state: z.string().optional(),
  source_kind: z.string().optional().nullable(),
  owner_label: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutEvent_definitionsInputObjectSchema).optional(),
  event_properties: z.lazy(() => event_propertiesCreateNestedManyWithoutEvent_definitionsInputObjectSchema).optional()
}).strict();
