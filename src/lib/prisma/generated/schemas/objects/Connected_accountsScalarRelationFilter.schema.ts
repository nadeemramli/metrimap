// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema'

export const Connected_accountsScalarRelationFilterObjectSchema: z.ZodType<Prisma.Connected_accountsScalarRelationFilter, Prisma.Connected_accountsScalarRelationFilter> = z.object({
  is: z.lazy(() => connected_accountsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => connected_accountsWhereInputObjectSchema).optional()
}).strict();
export const Connected_accountsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => connected_accountsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => connected_accountsWhereInputObjectSchema).optional()
}).strict();
