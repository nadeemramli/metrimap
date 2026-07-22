// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Group_membersFindManySchema } from '../findManygroup_members.schema';
import { Node_access_grantsFindManySchema } from '../findManynode_access_grants.schema';
import { Tag_audiencesFindManySchema } from '../findManytag_audiences.schema';
import { workspace_groupsCountOutputTypeArgsObjectSchema } from './workspace_groupsCountOutputTypeArgs.schema'

export const workspace_groupsSelectObjectSchema: z.ZodType<Prisma.workspace_groupsSelect, Prisma.workspace_groupsSelect> = z.object({
  id: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  color: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  group_members: z.union([z.boolean(), z.lazy(() => Group_membersFindManySchema)]).optional(),
  node_access_grants: z.union([z.boolean(), z.lazy(() => Node_access_grantsFindManySchema)]).optional(),
  tag_audiences: z.union([z.boolean(), z.lazy(() => Tag_audiencesFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => workspace_groupsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const workspace_groupsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  color: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  group_members: z.union([z.boolean(), z.lazy(() => Group_membersFindManySchema)]).optional(),
  node_access_grants: z.union([z.boolean(), z.lazy(() => Node_access_grantsFindManySchema)]).optional(),
  tag_audiences: z.union([z.boolean(), z.lazy(() => Tag_audiencesFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => workspace_groupsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
