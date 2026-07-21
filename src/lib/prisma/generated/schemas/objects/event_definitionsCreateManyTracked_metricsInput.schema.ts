// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const event_definitionsCreateManyTracked_metricsInputObjectSchema: z.ZodType<Prisma.event_definitionsCreateManyTracked_metricsInput, Prisma.event_definitionsCreateManyTracked_metricsInput> = z.object({
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
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const event_definitionsCreateManyTracked_metricsInputObjectZodSchema = z.object({
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
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
