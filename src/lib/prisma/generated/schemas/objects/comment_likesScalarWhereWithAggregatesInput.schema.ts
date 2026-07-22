// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const comment_likesScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.comment_likesScalarWhereWithAggregatesInput, Prisma.comment_likesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => comment_likesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_likesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_likesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_likesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_likesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  comment_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const comment_likesScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => comment_likesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_likesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_likesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_likesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_likesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  comment_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
