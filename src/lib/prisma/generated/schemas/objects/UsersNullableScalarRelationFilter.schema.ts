// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const UsersNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.UsersNullableScalarRelationFilter, Prisma.UsersNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => usersWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => usersWhereInputObjectSchema).optional().nullable()
}).strict();
export const UsersNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => usersWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => usersWhereInputObjectSchema).optional().nullable()
}).strict();
