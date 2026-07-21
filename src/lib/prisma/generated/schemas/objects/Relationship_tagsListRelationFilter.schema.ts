// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsWhereInputObjectSchema } from './relationship_tagsWhereInput.schema'

export const Relationship_tagsListRelationFilterObjectSchema: z.ZodType<Prisma.Relationship_tagsListRelationFilter, Prisma.Relationship_tagsListRelationFilter> = z.object({
  every: z.lazy(() => relationship_tagsWhereInputObjectSchema).optional(),
  some: z.lazy(() => relationship_tagsWhereInputObjectSchema).optional(),
  none: z.lazy(() => relationship_tagsWhereInputObjectSchema).optional()
}).strict();
export const Relationship_tagsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => relationship_tagsWhereInputObjectSchema).optional(),
  some: z.lazy(() => relationship_tagsWhereInputObjectSchema).optional(),
  none: z.lazy(() => relationship_tagsWhereInputObjectSchema).optional()
}).strict();
