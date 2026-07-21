// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { spacesWhereInputObjectSchema } from './spacesWhereInput.schema'

export const SpacesNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.SpacesNullableScalarRelationFilter, Prisma.SpacesNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => spacesWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => spacesWhereInputObjectSchema).optional().nullable()
}).strict();
export const SpacesNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => spacesWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => spacesWhereInputObjectSchema).optional().nullable()
}).strict();
