import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

export const usersScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.usersScalarWhereWithAggregatesInput, Prisma.usersScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => usersScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => usersScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => usersScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => usersScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => usersScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  email: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  avatar_url: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable()
}).strict();
export const usersScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => usersScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => usersScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => usersScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => usersScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => usersScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  email: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  avatar_url: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable()
}).strict();
