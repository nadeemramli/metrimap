// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersCreateNestedManyWithoutWorkspace_groupsInputObjectSchema } from './group_membersCreateNestedManyWithoutWorkspace_groupsInput.schema';
import { tag_audiencesCreateNestedManyWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesCreateNestedManyWithoutWorkspace_groupsInput.schema'

export const workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema: z.ZodType<Prisma.workspace_groupsCreateWithoutNode_access_grantsInput, Prisma.workspace_groupsCreateWithoutNode_access_grantsInput> = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  group_members: z.lazy(() => group_membersCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional()
}).strict();
export const workspace_groupsCreateWithoutNode_access_grantsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  group_members: z.lazy(() => group_membersCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesCreateNestedManyWithoutWorkspace_groupsInputObjectSchema).optional()
}).strict();
