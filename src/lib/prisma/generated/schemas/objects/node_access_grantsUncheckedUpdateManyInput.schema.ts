// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const node_access_grantsUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.node_access_grantsUncheckedUpdateManyInput, Prisma.node_access_grantsUncheckedUpdateManyInput> = z.object({
  metric_card_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const node_access_grantsUncheckedUpdateManyInputObjectZodSchema = z.object({
  metric_card_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  group_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
