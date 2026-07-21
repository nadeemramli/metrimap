// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUncheckedCreateWithoutMetric_cardsInput, Prisma.strategy_metric_linksUncheckedCreateWithoutMetric_cardsInput> = z.object({
  id: z.string().optional(),
  contract_id: z.string(),
  workspace_id: z.string().optional().nullable(),
  role: z.string(),
  ref_source: z.string(),
  tracked_metric_id: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  contract_id: z.string(),
  workspace_id: z.string().optional().nullable(),
  role: z.string(),
  ref_source: z.string(),
  tracked_metric_id: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
