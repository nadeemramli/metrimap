// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsArgsObjectSchema } from './event_definitionsArgs.schema'

export const event_propertiesIncludeObjectSchema: z.ZodType<Prisma.event_propertiesInclude, Prisma.event_propertiesInclude> = z.object({
  event_definitions: z.union([z.boolean(), z.lazy(() => event_definitionsArgsObjectSchema)]).optional()
}).strict();
export const event_propertiesIncludeObjectZodSchema = z.object({
  event_definitions: z.union([z.boolean(), z.lazy(() => event_definitionsArgsObjectSchema)]).optional()
}).strict();
