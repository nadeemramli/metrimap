// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateNestedOneWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsCreateNestedOneWithoutEvent_definitionsInput.schema'

export const event_definitionsCreateWithoutEvent_propertiesInputObjectSchema: z.ZodType<Prisma.event_definitionsCreateWithoutEvent_propertiesInput, Prisma.event_definitionsCreateWithoutEvent_propertiesInput> = z.object({
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
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutEvent_definitionsInputObjectSchema).optional()
}).strict();
export const event_definitionsCreateWithoutEvent_propertiesInputObjectZodSchema = z.object({
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
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutEvent_definitionsInputObjectSchema).optional()
}).strict();
