// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema';
import { strategy_impact_contractsArgsObjectSchema } from './strategy_impact_contractsArgs.schema';
import { tracked_metricsArgsObjectSchema } from './tracked_metricsArgs.schema'

export const strategy_metric_linksIncludeObjectSchema: z.ZodType<Prisma.strategy_metric_linksInclude, Prisma.strategy_metric_linksInclude> = z.object({
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  strategy_impact_contracts: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsArgsObjectSchema)]).optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
export const strategy_metric_linksIncludeObjectZodSchema = z.object({
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  strategy_impact_contracts: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsArgsObjectSchema)]).optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
