// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsSelectObjectSchema } from './event_definitionsSelect.schema';
import { event_definitionsIncludeObjectSchema } from './event_definitionsInclude.schema'

export const event_definitionsArgsObjectSchema = z.object({
  select: z.lazy(() => event_definitionsSelectObjectSchema).optional(),
  include: z.lazy(() => event_definitionsIncludeObjectSchema).optional()
}).strict();
export const event_definitionsArgsObjectZodSchema = z.object({
  select: z.lazy(() => event_definitionsSelectObjectSchema).optional(),
  include: z.lazy(() => event_definitionsIncludeObjectSchema).optional()
}).strict();
