// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProjectsListRelationFilterObjectSchema } from './ProjectsListRelationFilter.schema'

export const spacesWhereInputObjectSchema: z.ZodType<Prisma.spacesWhereInput, Prisma.spacesWhereInput> = z.object({
  AND: z.union([z.lazy(() => spacesWhereInputObjectSchema), z.lazy(() => spacesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => spacesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => spacesWhereInputObjectSchema), z.lazy(() => spacesWhereInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sort_order: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  projects: z.lazy(() => ProjectsListRelationFilterObjectSchema).optional()
}).strict();
export const spacesWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => spacesWhereInputObjectSchema), z.lazy(() => spacesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => spacesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => spacesWhereInputObjectSchema), z.lazy(() => spacesWhereInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sort_order: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  projects: z.lazy(() => ProjectsListRelationFilterObjectSchema).optional()
}).strict();
