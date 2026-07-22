// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Group_membersListRelationFilterObjectSchema } from './Group_membersListRelationFilter.schema';
import { Node_access_grantsListRelationFilterObjectSchema } from './Node_access_grantsListRelationFilter.schema';
import { Tag_audiencesListRelationFilterObjectSchema } from './Tag_audiencesListRelationFilter.schema'

export const workspace_groupsWhereInputObjectSchema: z.ZodType<Prisma.workspace_groupsWhereInput, Prisma.workspace_groupsWhereInput> = z.object({
  AND: z.union([z.lazy(() => workspace_groupsWhereInputObjectSchema), z.lazy(() => workspace_groupsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => workspace_groupsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => workspace_groupsWhereInputObjectSchema), z.lazy(() => workspace_groupsWhereInputObjectSchema).array()]).optional(),
  workspace_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  group_members: z.lazy(() => Group_membersListRelationFilterObjectSchema).optional(),
  node_access_grants: z.lazy(() => Node_access_grantsListRelationFilterObjectSchema).optional(),
  tag_audiences: z.lazy(() => Tag_audiencesListRelationFilterObjectSchema).optional()
}).strict();
export const workspace_groupsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => workspace_groupsWhereInputObjectSchema), z.lazy(() => workspace_groupsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => workspace_groupsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => workspace_groupsWhereInputObjectSchema), z.lazy(() => workspace_groupsWhereInputObjectSchema).array()]).optional(),
  workspace_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  group_members: z.lazy(() => Group_membersListRelationFilterObjectSchema).optional(),
  node_access_grants: z.lazy(() => Node_access_grantsListRelationFilterObjectSchema).optional(),
  tag_audiences: z.lazy(() => Tag_audiencesListRelationFilterObjectSchema).optional()
}).strict();
