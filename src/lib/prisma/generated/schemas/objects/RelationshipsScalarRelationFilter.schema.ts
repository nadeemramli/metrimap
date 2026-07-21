// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema'

export const RelationshipsScalarRelationFilterObjectSchema: z.ZodType<Prisma.RelationshipsScalarRelationFilter, Prisma.RelationshipsScalarRelationFilter> = z.object({
  is: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => relationshipsWhereInputObjectSchema).optional()
}).strict();
export const RelationshipsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => relationshipsWhereInputObjectSchema).optional()
}).strict();
