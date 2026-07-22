// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateNestedOneWithoutStrategy_impact_contractsInputObjectSchema } from './projectsCreateNestedOneWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksCreateNestedManyWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksCreateNestedManyWithoutStrategy_impact_contractsInput.schema'

export const strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsCreateWithoutMetric_cardsInput, Prisma.strategy_impact_contractsCreateWithoutMetric_cardsInput> = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  expected_direction: z.string().optional().nullable(),
  expected_delta_value: z.number().optional().nullable(),
  expected_delta_unit: z.string().optional().nullable(),
  baseline_start: z.string().optional().nullable(),
  baseline_end: z.string().optional().nullable(),
  measure_start: z.string().optional().nullable(),
  measure_end: z.string().optional().nullable(),
  baseline_is_manual: z.boolean().optional(),
  confidence: z.string().optional().nullable(),
  impact_status: z.string().optional(),
  owner_label: z.string().optional().nullable(),
  result_note: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksCreateNestedManyWithoutStrategy_impact_contractsInputObjectSchema).optional()
}).strict();
export const strategy_impact_contractsCreateWithoutMetric_cardsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  expected_direction: z.string().optional().nullable(),
  expected_delta_value: z.number().optional().nullable(),
  expected_delta_unit: z.string().optional().nullable(),
  baseline_start: z.string().optional().nullable(),
  baseline_end: z.string().optional().nullable(),
  measure_start: z.string().optional().nullable(),
  measure_end: z.string().optional().nullable(),
  baseline_is_manual: z.boolean().optional(),
  confidence: z.string().optional().nullable(),
  impact_status: z.string().optional(),
  owner_label: z.string().optional().nullable(),
  result_note: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksCreateNestedManyWithoutStrategy_impact_contractsInputObjectSchema).optional()
}).strict();
