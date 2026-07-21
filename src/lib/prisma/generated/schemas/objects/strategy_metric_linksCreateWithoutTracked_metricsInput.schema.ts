// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsCreateNestedOneWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInput.schema'

export const strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateWithoutTracked_metricsInput, Prisma.strategy_metric_linksCreateWithoutTracked_metricsInput> = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  role: z.string(),
  ref_source: z.string(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema)
}).strict();
export const strategy_metric_linksCreateWithoutTracked_metricsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  role: z.string(),
  ref_source: z.string(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema)
}).strict();
