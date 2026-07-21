// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema } from './tagsUpdateOneRequiredWithoutTag_audiencesNestedInput.schema'

export const tag_audiencesUpdateWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUpdateWithoutWorkspace_groupsInput, Prisma.tag_audiencesUpdateWithoutWorkspace_groupsInput> = z.object({
  tags: z.lazy(() => tagsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema).optional()
}).strict();
export const tag_audiencesUpdateWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  tags: z.lazy(() => tagsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema).optional()
}).strict();
