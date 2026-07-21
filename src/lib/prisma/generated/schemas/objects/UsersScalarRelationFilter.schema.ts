// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const UsersScalarRelationFilterObjectSchema: z.ZodType<Prisma.UsersScalarRelationFilter, Prisma.UsersScalarRelationFilter> = z.object({
  is: z.lazy(() => usersWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const UsersScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => usersWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
