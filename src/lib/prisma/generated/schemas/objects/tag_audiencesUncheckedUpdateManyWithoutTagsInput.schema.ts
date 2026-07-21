// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const tag_audiencesUncheckedUpdateManyWithoutTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUncheckedUpdateManyWithoutTagsInput, Prisma.tag_audiencesUncheckedUpdateManyWithoutTagsInput> = z.object({
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const tag_audiencesUncheckedUpdateManyWithoutTagsInputObjectZodSchema = z.object({
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
