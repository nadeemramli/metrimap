// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsWhereInputObjectSchema } from './source_connection_secretsWhereInput.schema'

export const Source_connection_secretsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.Source_connection_secretsNullableScalarRelationFilter, Prisma.Source_connection_secretsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => source_connection_secretsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => source_connection_secretsWhereInputObjectSchema).optional().nullable()
}).strict();
export const Source_connection_secretsNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => source_connection_secretsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => source_connection_secretsWhereInputObjectSchema).optional().nullable()
}).strict();
