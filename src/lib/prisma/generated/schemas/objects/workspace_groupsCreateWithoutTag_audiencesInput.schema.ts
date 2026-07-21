// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersCreateNestedManyWithoutWorkspace_groupsInputObjectSchema } from './group_membersCreateNestedManyWithoutWorkspace_groupsInput.schema';
import { node_access_grantsCreateNestedManyWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsCreateNestedManyWithoutWorkspace_groupsInput.schema'

export const workspace_groupsCreateWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.workspace_groupsCreateWithoutTag_audiencesInput, Prisma.workspace_groupsCreateWithoutTag_audiencesInput> = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  group_members: z.lazy(() => group_membersCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional()
}).strict();
export const workspace_groupsCreateWithoutTag_audiencesInputObjectZodSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  group_members: z.lazy(() => group_membersCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional()
}).strict();
