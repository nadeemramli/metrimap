import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const comment_mentionsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.comment_mentionsScalarWhereWithAggregatesInput, Prisma.comment_mentionsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => comment_mentionsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_mentionsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_mentionsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_mentionsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_mentionsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  comment_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  mentioned_user_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const comment_mentionsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => comment_mentionsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_mentionsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_mentionsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_mentionsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_mentionsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  comment_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  mentioned_user_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
