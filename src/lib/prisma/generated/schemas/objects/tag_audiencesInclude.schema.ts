// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsArgsObjectSchema } from './workspace_groupsArgs.schema';
import { tagsArgsObjectSchema } from './tagsArgs.schema'

export const tag_audiencesIncludeObjectSchema: z.ZodType<Prisma.tag_audiencesInclude, Prisma.tag_audiencesInclude> = z.object({
  workspace_groups: z.union([z.boolean(), z.lazy(() => workspace_groupsArgsObjectSchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => tagsArgsObjectSchema)]).optional()
}).strict();
export const tag_audiencesIncludeObjectZodSchema = z.object({
  workspace_groups: z.union([z.boolean(), z.lazy(() => workspace_groupsArgsObjectSchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => tagsArgsObjectSchema)]).optional()
}).strict();
