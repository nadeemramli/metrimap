// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { workspace_groupsOrderByWithRelationInputObjectSchema } from './workspace_groupsOrderByWithRelationInput.schema';
import { metric_cardsOrderByWithRelationInputObjectSchema } from './metric_cardsOrderByWithRelationInput.schema'

export const node_access_grantsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.node_access_grantsOrderByWithRelationInput, Prisma.node_access_grantsOrderByWithRelationInput> = z.object({
  metric_card_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional(),
  workspace_groups: z.lazy(() => workspace_groupsOrderByWithRelationInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const node_access_grantsOrderByWithRelationInputObjectZodSchema = z.object({
  metric_card_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional(),
  workspace_groups: z.lazy(() => workspace_groupsOrderByWithRelationInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional()
}).strict();
