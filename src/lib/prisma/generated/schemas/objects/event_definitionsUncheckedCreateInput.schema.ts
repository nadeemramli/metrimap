// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesUncheckedCreateNestedManyWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUncheckedCreateNestedManyWithoutEvent_definitionsInput.schema'

export const event_definitionsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.event_definitionsUncheckedCreateInput, Prisma.event_definitionsUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  key: z.string(),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lifecycle_state: z.string().optional(),
  source_kind: z.string().optional().nullable(),
  owner_label: z.string().optional().nullable(),
  tracked_metric_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  event_properties: z.lazy(() => event_propertiesUncheckedCreateNestedManyWithoutEvent_definitionsInputObjectSchema).optional()
}).strict();
export const event_definitionsUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  key: z.string(),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lifecycle_state: z.string().optional(),
  source_kind: z.string().optional().nullable(),
  owner_label: z.string().optional().nullable(),
  tracked_metric_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  event_properties: z.lazy(() => event_propertiesUncheckedCreateNestedManyWithoutEvent_definitionsInputObjectSchema).optional()
}).strict();
