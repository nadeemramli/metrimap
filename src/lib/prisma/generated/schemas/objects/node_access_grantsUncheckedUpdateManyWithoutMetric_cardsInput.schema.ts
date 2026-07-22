// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const node_access_grantsUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUncheckedUpdateManyWithoutMetric_cardsInput, Prisma.node_access_grantsUncheckedUpdateManyWithoutMetric_cardsInput> = z.object({
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const node_access_grantsUncheckedUpdateManyWithoutMetric_cardsInputObjectZodSchema = z.object({
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
