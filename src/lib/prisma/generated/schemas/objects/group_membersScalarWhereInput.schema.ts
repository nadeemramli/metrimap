// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const group_membersScalarWhereInputObjectSchema: z.ZodType<Prisma.group_membersScalarWhereInput, Prisma.group_membersScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => group_membersScalarWhereInputObjectSchema), z.lazy(() => group_membersScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => group_membersScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => group_membersScalarWhereInputObjectSchema), z.lazy(() => group_membersScalarWhereInputObjectSchema).array()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  added_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  added_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const group_membersScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => group_membersScalarWhereInputObjectSchema), z.lazy(() => group_membersScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => group_membersScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => group_membersScalarWhereInputObjectSchema), z.lazy(() => group_membersScalarWhereInputObjectSchema).array()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  added_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  added_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
