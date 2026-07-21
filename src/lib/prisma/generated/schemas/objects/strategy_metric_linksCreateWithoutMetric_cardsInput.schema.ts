// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInput.schema'

export const strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateWithoutMetric_cardsInput, Prisma.strategy_metric_linksCreateWithoutMetric_cardsInput> = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  role: z.string(),
  ref_source: z.string(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema),
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema).optional()
}).strict();
export const strategy_metric_linksCreateWithoutMetric_cardsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  role: z.string(),
  ref_source: z.string(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema),
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema).optional()
}).strict();
