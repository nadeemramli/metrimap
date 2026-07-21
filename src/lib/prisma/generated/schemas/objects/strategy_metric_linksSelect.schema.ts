// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema';
import { strategy_impact_contractsArgsObjectSchema } from './strategy_impact_contractsArgs.schema';
import { tracked_metricsArgsObjectSchema } from './tracked_metricsArgs.schema'

export const strategy_metric_linksSelectObjectSchema: z.ZodType<Prisma.strategy_metric_linksSelect, Prisma.strategy_metric_linksSelect> = z.object({
  id: z.boolean().optional(),
  contract_id: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  role: z.boolean().optional(),
  ref_source: z.boolean().optional(),
  tracked_metric_id: z.boolean().optional(),
  card_id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  strategy_impact_contracts: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsArgsObjectSchema)]).optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
export const strategy_metric_linksSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  contract_id: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  role: z.boolean().optional(),
  ref_source: z.boolean().optional(),
  tracked_metric_id: z.boolean().optional(),
  card_id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  strategy_impact_contracts: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsArgsObjectSchema)]).optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
