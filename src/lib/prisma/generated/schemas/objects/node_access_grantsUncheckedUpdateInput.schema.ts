// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const node_access_grantsUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.node_access_grantsUncheckedUpdateInput, Prisma.node_access_grantsUncheckedUpdateInput> = z.object({
  metric_card_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const node_access_grantsUncheckedUpdateInputObjectZodSchema = z.object({
  metric_card_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
