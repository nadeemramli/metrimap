// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Group_membersFindManySchema } from '../findManygroup_members.schema';
import { Node_access_grantsFindManySchema } from '../findManynode_access_grants.schema';
import { Tag_audiencesFindManySchema } from '../findManytag_audiences.schema';
import { workspace_groupsCountOutputTypeArgsObjectSchema } from './workspace_groupsCountOutputTypeArgs.schema'

export const workspace_groupsIncludeObjectSchema: z.ZodType<Prisma.workspace_groupsInclude, Prisma.workspace_groupsInclude> = z.object({
  group_members: z.union([z.boolean(), z.lazy(() => Group_membersFindManySchema)]).optional(),
  node_access_grants: z.union([z.boolean(), z.lazy(() => Node_access_grantsFindManySchema)]).optional(),
  tag_audiences: z.union([z.boolean(), z.lazy(() => Tag_audiencesFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => workspace_groupsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const workspace_groupsIncludeObjectZodSchema = z.object({
  group_members: z.union([z.boolean(), z.lazy(() => Group_membersFindManySchema)]).optional(),
  node_access_grants: z.union([z.boolean(), z.lazy(() => Node_access_grantsFindManySchema)]).optional(),
  tag_audiences: z.union([z.boolean(), z.lazy(() => Tag_audiencesFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => workspace_groupsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
