// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema } from './workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInput.schema'

export const tag_audiencesUpdateWithoutTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUpdateWithoutTagsInput, Prisma.tag_audiencesUpdateWithoutTagsInput> = z.object({
  workspace_groups: z.lazy(() => workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema).optional()
}).strict();
export const tag_audiencesUpdateWithoutTagsInputObjectZodSchema = z.object({
  workspace_groups: z.lazy(() => workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema).optional()
}).strict();
