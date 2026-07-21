// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema'

export const metric_card_tagsUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpdateManyMutationInput, Prisma.metric_card_tagsUpdateManyMutationInput> = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable()
}).strict();
export const metric_card_tagsUpdateManyMutationInputObjectZodSchema = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable()
}).strict();
