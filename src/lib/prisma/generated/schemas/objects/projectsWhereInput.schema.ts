import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema'

export const projectsWhereInputObjectSchema: z.ZodType<Prisma.projectsWhereInput, Prisma.projectsWhereInput> = z.object({
  AND: z.union([z.lazy(() => projectsWhereInputObjectSchema), z.lazy(() => projectsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => projectsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => projectsWhereInputObjectSchema), z.lazy(() => projectsWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  settings: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  last_modified_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  is_public: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const projectsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => projectsWhereInputObjectSchema), z.lazy(() => projectsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => projectsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => projectsWhereInputObjectSchema), z.lazy(() => projectsWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  settings: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  last_modified_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  is_public: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional()
}).strict();
