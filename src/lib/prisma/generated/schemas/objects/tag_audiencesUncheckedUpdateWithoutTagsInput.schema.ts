// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const tag_audiencesUncheckedUpdateWithoutTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUncheckedUpdateWithoutTagsInput, Prisma.tag_audiencesUncheckedUpdateWithoutTagsInput> = z.object({
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const tag_audiencesUncheckedUpdateWithoutTagsInputObjectZodSchema = z.object({
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
