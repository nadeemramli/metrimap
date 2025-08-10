import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const usersWhereInputObjectSchema: z.ZodType<Prisma.usersWhereInput, Prisma.usersWhereInput> = z.object({
  AND: z.union([z.lazy(() => usersWhereInputObjectSchema), z.lazy(() => usersWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => usersWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => usersWhereInputObjectSchema), z.lazy(() => usersWhereInputObjectSchema).array()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  avatar_url: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable()
}).strict();
export const usersWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => usersWhereInputObjectSchema), z.lazy(() => usersWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => usersWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => usersWhereInputObjectSchema), z.lazy(() => usersWhereInputObjectSchema).array()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  avatar_url: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable()
}).strict();
