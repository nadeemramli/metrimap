// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsWhereInputObjectSchema } from './event_definitionsWhereInput.schema'

export const Event_definitionsScalarRelationFilterObjectSchema: z.ZodType<Prisma.Event_definitionsScalarRelationFilter, Prisma.Event_definitionsScalarRelationFilter> = z.object({
  is: z.lazy(() => event_definitionsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => event_definitionsWhereInputObjectSchema).optional()
}).strict();
export const Event_definitionsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => event_definitionsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => event_definitionsWhereInputObjectSchema).optional()
}).strict();
