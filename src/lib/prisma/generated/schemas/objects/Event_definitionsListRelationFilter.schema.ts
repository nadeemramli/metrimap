// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsWhereInputObjectSchema } from './event_definitionsWhereInput.schema'

export const Event_definitionsListRelationFilterObjectSchema: z.ZodType<Prisma.Event_definitionsListRelationFilter, Prisma.Event_definitionsListRelationFilter> = z.object({
  every: z.lazy(() => event_definitionsWhereInputObjectSchema).optional(),
  some: z.lazy(() => event_definitionsWhereInputObjectSchema).optional(),
  none: z.lazy(() => event_definitionsWhereInputObjectSchema).optional()
}).strict();
export const Event_definitionsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => event_definitionsWhereInputObjectSchema).optional(),
  some: z.lazy(() => event_definitionsWhereInputObjectSchema).optional(),
  none: z.lazy(() => event_definitionsWhereInputObjectSchema).optional()
}).strict();
