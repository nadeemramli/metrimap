// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyWhereInputObjectSchema } from './relationship_historyWhereInput.schema'

export const Relationship_historyListRelationFilterObjectSchema: z.ZodType<Prisma.Relationship_historyListRelationFilter, Prisma.Relationship_historyListRelationFilter> = z.object({
  every: z.lazy(() => relationship_historyWhereInputObjectSchema).optional(),
  some: z.lazy(() => relationship_historyWhereInputObjectSchema).optional(),
  none: z.lazy(() => relationship_historyWhereInputObjectSchema).optional()
}).strict();
export const Relationship_historyListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => relationship_historyWhereInputObjectSchema).optional(),
  some: z.lazy(() => relationship_historyWhereInputObjectSchema).optional(),
  none: z.lazy(() => relationship_historyWhereInputObjectSchema).optional()
}).strict();
