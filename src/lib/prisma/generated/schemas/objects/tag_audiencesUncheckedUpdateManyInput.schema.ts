// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const tag_audiencesUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.tag_audiencesUncheckedUpdateManyInput, Prisma.tag_audiencesUncheckedUpdateManyInput> = z.object({
  tag_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const tag_audiencesUncheckedUpdateManyInputObjectZodSchema = z.object({
  tag_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
