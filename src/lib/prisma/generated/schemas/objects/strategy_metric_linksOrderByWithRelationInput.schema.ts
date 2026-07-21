// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { metric_cardsOrderByWithRelationInputObjectSchema } from './metric_cardsOrderByWithRelationInput.schema';
import { strategy_impact_contractsOrderByWithRelationInputObjectSchema } from './strategy_impact_contractsOrderByWithRelationInput.schema';
import { tracked_metricsOrderByWithRelationInputObjectSchema } from './tracked_metricsOrderByWithRelationInput.schema'

export const strategy_metric_linksOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksOrderByWithRelationInput, Prisma.strategy_metric_linksOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  contract_id: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  role: SortOrderSchema.optional(),
  ref_source: SortOrderSchema.optional(),
  tracked_metric_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsOrderByWithRelationInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const strategy_metric_linksOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  contract_id: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  role: SortOrderSchema.optional(),
  ref_source: SortOrderSchema.optional(),
  tracked_metric_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsOrderByWithRelationInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsOrderByWithRelationInputObjectSchema).optional()
}).strict();
