// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateNestedOneWithoutTag_audiencesInputObjectSchema } from './workspace_groupsCreateNestedOneWithoutTag_audiencesInput.schema'

export const tag_audiencesCreateWithoutTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesCreateWithoutTagsInput, Prisma.tag_audiencesCreateWithoutTagsInput> = z.object({
  workspace_groups: z.lazy(() => workspace_groupsCreateNestedOneWithoutTag_audiencesInputObjectSchema)
}).strict();
export const tag_audiencesCreateWithoutTagsInputObjectZodSchema = z.object({
  workspace_groups: z.lazy(() => workspace_groupsCreateNestedOneWithoutTag_audiencesInputObjectSchema)
}).strict();
