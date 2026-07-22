// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { Metric_card_tagsListRelationFilterObjectSchema } from './Metric_card_tagsListRelationFilter.schema';
import { Relationship_tagsListRelationFilterObjectSchema } from './Relationship_tagsListRelationFilter.schema';
import { Tag_audiencesListRelationFilterObjectSchema } from './Tag_audiencesListRelationFilter.schema';
import { UsersNullableScalarRelationFilterObjectSchema } from './UsersNullableScalarRelationFilter.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { ProjectsNullableScalarRelationFilterObjectSchema } from './ProjectsNullableScalarRelationFilter.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const tagsWhereInputObjectSchema: z.ZodType<Prisma.tagsWhereInput, Prisma.tagsWhereInput> = z.object({
  AND: z.union([z.lazy(() => tagsWhereInputObjectSchema), z.lazy(() => tagsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tagsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tagsWhereInputObjectSchema), z.lazy(() => tagsWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  is_access: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  redaction_mode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  metric_card_tags: z.lazy(() => Metric_card_tagsListRelationFilterObjectSchema).optional(),
  relationship_tags: z.lazy(() => Relationship_tagsListRelationFilterObjectSchema).optional(),
  tag_audiences: z.lazy(() => Tag_audiencesListRelationFilterObjectSchema).optional(),
  users: z.union([z.lazy(() => UsersNullableScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional().nullable(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable()
}).strict();
export const tagsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => tagsWhereInputObjectSchema), z.lazy(() => tagsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tagsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tagsWhereInputObjectSchema), z.lazy(() => tagsWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  is_access: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  redaction_mode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  metric_card_tags: z.lazy(() => Metric_card_tagsListRelationFilterObjectSchema).optional(),
  relationship_tags: z.lazy(() => Relationship_tagsListRelationFilterObjectSchema).optional(),
  tag_audiences: z.lazy(() => Tag_audiencesListRelationFilterObjectSchema).optional(),
  users: z.union([z.lazy(() => UsersNullableScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional().nullable(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable()
}).strict();
