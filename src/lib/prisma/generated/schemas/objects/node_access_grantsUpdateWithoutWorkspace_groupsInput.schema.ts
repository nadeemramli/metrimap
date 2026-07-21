// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema } from './metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInput.schema'

export const node_access_grantsUpdateWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUpdateWithoutWorkspace_groupsInput, Prisma.node_access_grantsUpdateWithoutWorkspace_groupsInput> = z.object({
  metric_cards: z.lazy(() => metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema).optional()
}).strict();
export const node_access_grantsUpdateWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  metric_cards: z.lazy(() => metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema).optional()
}).strict();
