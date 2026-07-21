// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Event_definitionsCountOutputTypeSelectObjectSchema } from './Event_definitionsCountOutputTypeSelect.schema'

export const Event_definitionsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => Event_definitionsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const Event_definitionsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => Event_definitionsCountOutputTypeSelectObjectSchema).optional()
}).strict();
