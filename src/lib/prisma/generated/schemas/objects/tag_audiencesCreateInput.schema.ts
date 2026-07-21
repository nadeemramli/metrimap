// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateNestedOneWithoutTag_audiencesInputObjectSchema } from './workspace_groupsCreateNestedOneWithoutTag_audiencesInput.schema';
import { tagsCreateNestedOneWithoutTag_audiencesInputObjectSchema } from './tagsCreateNestedOneWithoutTag_audiencesInput.schema'

export const tag_audiencesCreateInputObjectSchema: z.ZodType<Prisma.tag_audiencesCreateInput, Prisma.tag_audiencesCreateInput> = z.object({
  workspace_groups: z.lazy(() => workspace_groupsCreateNestedOneWithoutTag_audiencesInputObjectSchema),
  tags: z.lazy(() => tagsCreateNestedOneWithoutTag_audiencesInputObjectSchema)
}).strict();
export const tag_audiencesCreateInputObjectZodSchema = z.object({
  workspace_groups: z.lazy(() => workspace_groupsCreateNestedOneWithoutTag_audiencesInputObjectSchema),
  tags: z.lazy(() => tagsCreateNestedOneWithoutTag_audiencesInputObjectSchema)
}).strict();
