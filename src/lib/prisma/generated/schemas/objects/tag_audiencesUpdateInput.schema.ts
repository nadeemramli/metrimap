// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema } from './workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInput.schema';
import { tagsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema } from './tagsUpdateOneRequiredWithoutTag_audiencesNestedInput.schema'

export const tag_audiencesUpdateInputObjectSchema: z.ZodType<Prisma.tag_audiencesUpdateInput, Prisma.tag_audiencesUpdateInput> = z.object({
  workspace_groups: z.lazy(() => workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema).optional()
}).strict();
export const tag_audiencesUpdateInputObjectZodSchema = z.object({
  workspace_groups: z.lazy(() => workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema).optional()
}).strict();
