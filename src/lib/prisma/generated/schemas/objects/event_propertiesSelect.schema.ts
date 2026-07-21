// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsArgsObjectSchema } from './event_definitionsArgs.schema'

export const event_propertiesSelectObjectSchema: z.ZodType<Prisma.event_propertiesSelect, Prisma.event_propertiesSelect> = z.object({
  id: z.boolean().optional(),
  event_id: z.boolean().optional(),
  name: z.boolean().optional(),
  key: z.boolean().optional(),
  data_type: z.boolean().optional(),
  required: z.boolean().optional(),
  allowed_values: z.boolean().optional(),
  example_value: z.boolean().optional(),
  description: z.boolean().optional(),
  created_at: z.boolean().optional(),
  event_definitions: z.union([z.boolean(), z.lazy(() => event_definitionsArgsObjectSchema)]).optional()
}).strict();
export const event_propertiesSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  event_id: z.boolean().optional(),
  name: z.boolean().optional(),
  key: z.boolean().optional(),
  data_type: z.boolean().optional(),
  required: z.boolean().optional(),
  allowed_values: z.boolean().optional(),
  example_value: z.boolean().optional(),
  description: z.boolean().optional(),
  created_at: z.boolean().optional(),
  event_definitions: z.union([z.boolean(), z.lazy(() => event_definitionsArgsObjectSchema)]).optional()
}).strict();
