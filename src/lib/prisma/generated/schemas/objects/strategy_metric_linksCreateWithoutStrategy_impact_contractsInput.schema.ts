// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsCreateNestedOneWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInput.schema'

export const strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateWithoutStrategy_impact_contractsInput, Prisma.strategy_metric_linksCreateWithoutStrategy_impact_contractsInput> = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  role: z.string(),
  ref_source: z.string(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema).optional()
}).strict();
export const strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  role: z.string(),
  ref_source: z.string(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema).optional()
}).strict();
