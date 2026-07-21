// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const group_membersScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.group_membersScalarWhereWithAggregatesInput, Prisma.group_membersScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => group_membersScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => group_membersScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => group_membersScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => group_membersScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => group_membersScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  group_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  added_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  added_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const group_membersScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => group_membersScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => group_membersScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => group_membersScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => group_membersScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => group_membersScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  group_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  added_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  added_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
