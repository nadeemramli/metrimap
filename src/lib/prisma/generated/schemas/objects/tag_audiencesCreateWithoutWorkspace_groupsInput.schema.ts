// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateNestedOneWithoutTag_audiencesInputObjectSchema } from './tagsCreateNestedOneWithoutTag_audiencesInput.schema'

export const tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.tag_audiencesCreateWithoutWorkspace_groupsInput, Prisma.tag_audiencesCreateWithoutWorkspace_groupsInput> = z.object({
  tags: z.lazy(() => tagsCreateNestedOneWithoutTag_audiencesInputObjectSchema)
}).strict();
export const tag_audiencesCreateWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  tags: z.lazy(() => tagsCreateNestedOneWithoutTag_audiencesInputObjectSchema)
}).strict();
