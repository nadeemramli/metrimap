// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_account_secretsWhereInputObjectSchema } from './connected_account_secretsWhereInput.schema'

export const Connected_account_secretsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.Connected_account_secretsNullableScalarRelationFilter, Prisma.Connected_account_secretsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => connected_account_secretsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => connected_account_secretsWhereInputObjectSchema).optional().nullable()
}).strict();
export const Connected_account_secretsNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => connected_account_secretsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => connected_account_secretsWhereInputObjectSchema).optional().nullable()
}).strict();
