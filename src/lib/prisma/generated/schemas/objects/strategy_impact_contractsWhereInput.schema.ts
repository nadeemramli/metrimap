// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProjectsNullableScalarRelationFilterObjectSchema } from './ProjectsNullableScalarRelationFilter.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { Metric_cardsScalarRelationFilterObjectSchema } from './Metric_cardsScalarRelationFilter.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { Strategy_metric_linksListRelationFilterObjectSchema } from './Strategy_metric_linksListRelationFilter.schema'

export const strategy_impact_contractsWhereInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsWhereInput, Prisma.strategy_impact_contractsWhereInput> = z.object({
  AND: z.union([z.lazy(() => strategy_impact_contractsWhereInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => strategy_impact_contractsWhereInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).array()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  strategy_node_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  expected_direction: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  expected_delta_value: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  expected_delta_unit: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  baseline_start: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  baseline_end: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  measure_start: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  measure_end: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  baseline_is_manual: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  confidence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  impact_status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  owner_label: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  result_note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable(),
  metric_cards: z.union([z.lazy(() => Metric_cardsScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  strategy_metric_links: z.lazy(() => Strategy_metric_linksListRelationFilterObjectSchema).optional()
}).strict();
export const strategy_impact_contractsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => strategy_impact_contractsWhereInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => strategy_impact_contractsWhereInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).array()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  strategy_node_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  expected_direction: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  expected_delta_value: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  expected_delta_unit: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  baseline_start: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  baseline_end: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  measure_start: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  measure_end: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  baseline_is_manual: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  confidence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  impact_status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  owner_label: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  result_note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable(),
  metric_cards: z.union([z.lazy(() => Metric_cardsScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  strategy_metric_links: z.lazy(() => Strategy_metric_linksListRelationFilterObjectSchema).optional()
}).strict();
