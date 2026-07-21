// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsArgsObjectSchema } from './workspace_groupsArgs.schema';
import { tagsArgsObjectSchema } from './tagsArgs.schema'

export const tag_audiencesSelectObjectSchema: z.ZodType<Prisma.tag_audiencesSelect, Prisma.tag_audiencesSelect> = z.object({
  tag_id: z.boolean().optional(),
  group_id: z.boolean().optional(),
  workspace_groups: z.union([z.boolean(), z.lazy(() => workspace_groupsArgsObjectSchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => tagsArgsObjectSchema)]).optional()
}).strict();
export const tag_audiencesSelectObjectZodSchema = z.object({
  tag_id: z.boolean().optional(),
  group_id: z.boolean().optional(),
  workspace_groups: z.union([z.boolean(), z.lazy(() => workspace_groupsArgsObjectSchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => tagsArgsObjectSchema)]).optional()
}).strict();
