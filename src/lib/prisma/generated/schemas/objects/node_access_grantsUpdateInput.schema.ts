// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema } from './workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInput.schema';
import { metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema } from './metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInput.schema'

export const node_access_grantsUpdateInputObjectSchema: z.ZodType<Prisma.node_access_grantsUpdateInput, Prisma.node_access_grantsUpdateInput> = z.object({
  workspace_groups: z.lazy(() => workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema).optional()
}).strict();
export const node_access_grantsUpdateInputObjectZodSchema = z.object({
  workspace_groups: z.lazy(() => workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema).optional()
}).strict();
