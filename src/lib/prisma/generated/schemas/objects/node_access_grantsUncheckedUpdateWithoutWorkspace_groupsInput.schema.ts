// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInput, Prisma.node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInput> = z.object({
  metric_card_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const node_access_grantsUncheckedUpdateWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  metric_card_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
