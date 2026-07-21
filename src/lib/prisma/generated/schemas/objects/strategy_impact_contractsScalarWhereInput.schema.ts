// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const strategy_impact_contractsScalarWhereInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsScalarWhereInput, Prisma.strategy_impact_contractsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema), z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema), z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
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
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const strategy_impact_contractsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema), z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema), z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
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
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
