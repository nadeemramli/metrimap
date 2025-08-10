import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { UuidNullableWithAggregatesFilterObjectSchema } from './UuidNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const comment_threadsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.comment_threadsScalarWhereWithAggregatesInput, Prisma.comment_threadsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => comment_threadsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_threadsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_threadsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_threadsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_threadsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  source: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  context: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  is_resolved: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  created_by: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional()
}).strict();
export const comment_threadsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => comment_threadsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_threadsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_threadsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_threadsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => comment_threadsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  source: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  context: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  is_resolved: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  created_by: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional()
}).strict();
