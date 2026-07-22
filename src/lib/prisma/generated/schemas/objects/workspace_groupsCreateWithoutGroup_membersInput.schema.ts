// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsCreateNestedManyWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsCreateNestedManyWithoutWorkspace_groupsInput.schema';
import { tag_audiencesCreateNestedManyWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesCreateNestedManyWithoutWorkspace_groupsInput.schema'

export const workspace_groupsCreateWithoutGroup_membersInputObjectSchema: z.ZodType<Prisma.workspace_groupsCreateWithoutGroup_membersInput, Prisma.workspace_groupsCreateWithoutGroup_membersInput> = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  node_access_grants: z.lazy(() => node_access_grantsCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional()
}).strict();
export const workspace_groupsCreateWithoutGroup_membersInputObjectZodSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  node_access_grants: z.lazy(() => node_access_grantsCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional()
}).strict();
