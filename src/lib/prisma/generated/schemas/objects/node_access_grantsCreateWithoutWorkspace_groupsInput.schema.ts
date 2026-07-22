// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateNestedOneWithoutNode_access_grantsInputObjectSchema } from './metric_cardsCreateNestedOneWithoutNode_access_grantsInput.schema'

export const node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.node_access_grantsCreateWithoutWorkspace_groupsInput, Prisma.node_access_grantsCreateWithoutWorkspace_groupsInput> = z.object({
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutNode_access_grantsInputObjectSchema)
}).strict();
export const node_access_grantsCreateWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutNode_access_grantsInputObjectSchema)
}).strict();
