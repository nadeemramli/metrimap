// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema'

export const Connected_accountsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.Connected_accountsNullableScalarRelationFilter, Prisma.Connected_accountsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => connected_accountsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => connected_accountsWhereInputObjectSchema).optional().nullable()
}).strict();
export const Connected_accountsNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => connected_accountsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => connected_accountsWhereInputObjectSchema).optional().nullable()
}).strict();
