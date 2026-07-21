// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { Workspace_groupsScalarRelationFilterObjectSchema } from './Workspace_groupsScalarRelationFilter.schema';
import { workspace_groupsWhereInputObjectSchema } from './workspace_groupsWhereInput.schema';
import { TagsScalarRelationFilterObjectSchema } from './TagsScalarRelationFilter.schema';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema'

export const tag_audiencesWhereInputObjectSchema: z.ZodType<Prisma.tag_audiencesWhereInput, Prisma.tag_audiencesWhereInput> = z.object({
  AND: z.union([z.lazy(() => tag_audiencesWhereInputObjectSchema), z.lazy(() => tag_audiencesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tag_audiencesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tag_audiencesWhereInputObjectSchema), z.lazy(() => tag_audiencesWhereInputObjectSchema).array()]).optional(),
  tag_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  workspace_groups: z.union([z.lazy(() => Workspace_groupsScalarRelationFilterObjectSchema), z.lazy(() => workspace_groupsWhereInputObjectSchema)]).optional(),
  tags: z.union([z.lazy(() => TagsScalarRelationFilterObjectSchema), z.lazy(() => tagsWhereInputObjectSchema)]).optional()
}).strict();
export const tag_audiencesWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => tag_audiencesWhereInputObjectSchema), z.lazy(() => tag_audiencesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tag_audiencesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tag_audiencesWhereInputObjectSchema), z.lazy(() => tag_audiencesWhereInputObjectSchema).array()]).optional(),
  tag_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  workspace_groups: z.union([z.lazy(() => Workspace_groupsScalarRelationFilterObjectSchema), z.lazy(() => workspace_groupsWhereInputObjectSchema)]).optional(),
  tags: z.union([z.lazy(() => TagsScalarRelationFilterObjectSchema), z.lazy(() => tagsWhereInputObjectSchema)]).optional()
}).strict();
