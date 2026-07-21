// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateNestedOneWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsCreateNestedOneWithoutNode_access_grantsInput.schema';
import { metric_cardsCreateNestedOneWithoutNode_access_grantsInputObjectSchema } from './metric_cardsCreateNestedOneWithoutNode_access_grantsInput.schema'

export const node_access_grantsCreateInputObjectSchema: z.ZodType<Prisma.node_access_grantsCreateInput, Prisma.node_access_grantsCreateInput> = z.object({
  workspace_groups: z.lazy(() => workspace_groupsCreateNestedOneWithoutNode_access_grantsInputObjectSchema),
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutNode_access_grantsInputObjectSchema)
}).strict();
export const node_access_grantsCreateInputObjectZodSchema = z.object({
  workspace_groups: z.lazy(() => workspace_groupsCreateNestedOneWithoutNode_access_grantsInputObjectSchema),
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutNode_access_grantsInputObjectSchema)
}).strict();
