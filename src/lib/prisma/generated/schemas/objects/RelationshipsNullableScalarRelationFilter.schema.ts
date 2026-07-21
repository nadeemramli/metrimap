// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema'

export const RelationshipsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.RelationshipsNullableScalarRelationFilter, Prisma.RelationshipsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => relationshipsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => relationshipsWhereInputObjectSchema).optional().nullable()
}).strict();
export const RelationshipsNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => relationshipsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => relationshipsWhereInputObjectSchema).optional().nullable()
}).strict();
