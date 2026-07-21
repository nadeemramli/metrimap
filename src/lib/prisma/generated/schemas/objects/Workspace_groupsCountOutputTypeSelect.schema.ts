// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Workspace_groupsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.Workspace_groupsCountOutputTypeSelect, Prisma.Workspace_groupsCountOutputTypeSelect> = z.object({
  group_members: z.boolean().optional(),
  node_access_grants: z.boolean().optional(),
  tag_audiences: z.boolean().optional()
}).strict();
export const Workspace_groupsCountOutputTypeSelectObjectZodSchema = z.object({
  group_members: z.boolean().optional(),
  node_access_grants: z.boolean().optional(),
  tag_audiences: z.boolean().optional()
}).strict();
