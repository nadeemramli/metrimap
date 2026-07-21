// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Metric_cardsNullableScalarRelationFilterObjectSchema } from './Metric_cardsNullableScalarRelationFilter.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { Strategy_impact_contractsScalarRelationFilterObjectSchema } from './Strategy_impact_contractsScalarRelationFilter.schema';
import { strategy_impact_contractsWhereInputObjectSchema } from './strategy_impact_contractsWhereInput.schema';
import { Tracked_metricsNullableScalarRelationFilterObjectSchema } from './Tracked_metricsNullableScalarRelationFilter.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema'

export const strategy_metric_linksWhereInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksWhereInput, Prisma.strategy_metric_linksWhereInput> = z.object({
  AND: z.union([z.lazy(() => strategy_metric_linksWhereInputObjectSchema), z.lazy(() => strategy_metric_linksWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => strategy_metric_linksWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => strategy_metric_linksWhereInputObjectSchema), z.lazy(() => strategy_metric_linksWhereInputObjectSchema).array()]).optional(),
  contract_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ref_source: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  metric_cards: z.union([z.lazy(() => Metric_cardsNullableScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional().nullable(),
  strategy_impact_contracts: z.union([z.lazy(() => Strategy_impact_contractsScalarRelationFilterObjectSchema), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema)]).optional(),
  tracked_metrics: z.union([z.lazy(() => Tracked_metricsNullableScalarRelationFilterObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional().nullable()
}).strict();
export const strategy_metric_linksWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => strategy_metric_linksWhereInputObjectSchema), z.lazy(() => strategy_metric_linksWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => strategy_metric_linksWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => strategy_metric_linksWhereInputObjectSchema), z.lazy(() => strategy_metric_linksWhereInputObjectSchema).array()]).optional(),
  contract_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ref_source: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  metric_cards: z.union([z.lazy(() => Metric_cardsNullableScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional().nullable(),
  strategy_impact_contracts: z.union([z.lazy(() => Strategy_impact_contractsScalarRelationFilterObjectSchema), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema)]).optional(),
  tracked_metrics: z.union([z.lazy(() => Tracked_metricsNullableScalarRelationFilterObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional().nullable()
}).strict();
