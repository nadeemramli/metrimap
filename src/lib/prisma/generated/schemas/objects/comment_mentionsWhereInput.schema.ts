import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const comment_mentionsWhereInputObjectSchema: z.ZodType<Prisma.comment_mentionsWhereInput, Prisma.comment_mentionsWhereInput> = z.object({
  AND: z.union([z.lazy(() => comment_mentionsWhereInputObjectSchema), z.lazy(() => comment_mentionsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_mentionsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_mentionsWhereInputObjectSchema), z.lazy(() => comment_mentionsWhereInputObjectSchema).array()]).optional(),
  comment_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  mentioned_user_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const comment_mentionsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => comment_mentionsWhereInputObjectSchema), z.lazy(() => comment_mentionsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_mentionsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_mentionsWhereInputObjectSchema), z.lazy(() => comment_mentionsWhereInputObjectSchema).array()]).optional(),
  comment_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  mentioned_user_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
