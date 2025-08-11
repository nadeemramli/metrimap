import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const notificationsWhereInputObjectSchema: z.ZodType<Prisma.notificationsWhereInput, Prisma.notificationsWhereInput> = z.object({
  AND: z.union([z.lazy(() => notificationsWhereInputObjectSchema), z.lazy(() => notificationsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => notificationsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => notificationsWhereInputObjectSchema), z.lazy(() => notificationsWhereInputObjectSchema).array()]).optional(),
  user_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  read: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  metadata: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const notificationsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => notificationsWhereInputObjectSchema), z.lazy(() => notificationsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => notificationsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => notificationsWhereInputObjectSchema), z.lazy(() => notificationsWhereInputObjectSchema).array()]).optional(),
  user_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  read: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  metadata: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
