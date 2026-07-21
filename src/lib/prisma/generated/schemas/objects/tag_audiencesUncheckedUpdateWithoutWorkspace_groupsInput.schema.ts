// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInput, Prisma.tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInput> = z.object({
  tag_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const tag_audiencesUncheckedUpdateWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  tag_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
