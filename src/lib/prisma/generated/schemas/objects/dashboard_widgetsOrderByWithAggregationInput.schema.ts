// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { dashboard_widgetsCountOrderByAggregateInputObjectSchema } from './dashboard_widgetsCountOrderByAggregateInput.schema';
import { dashboard_widgetsAvgOrderByAggregateInputObjectSchema } from './dashboard_widgetsAvgOrderByAggregateInput.schema';
import { dashboard_widgetsMaxOrderByAggregateInputObjectSchema } from './dashboard_widgetsMaxOrderByAggregateInput.schema';
import { dashboard_widgetsMinOrderByAggregateInputObjectSchema } from './dashboard_widgetsMinOrderByAggregateInput.schema';
import { dashboard_widgetsSumOrderByAggregateInputObjectSchema } from './dashboard_widgetsSumOrderByAggregateInput.schema'

export const dashboard_widgetsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsOrderByWithAggregationInput, Prisma.dashboard_widgetsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  widget_type: SortOrderSchema.optional(),
  config: SortOrderSchema.optional(),
  layout: SortOrderSchema.optional(),
  sort_index: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  group_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => dashboard_widgetsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => dashboard_widgetsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => dashboard_widgetsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => dashboard_widgetsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => dashboard_widgetsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const dashboard_widgetsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  widget_type: SortOrderSchema.optional(),
  config: SortOrderSchema.optional(),
  layout: SortOrderSchema.optional(),
  sort_index: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  group_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => dashboard_widgetsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => dashboard_widgetsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => dashboard_widgetsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => dashboard_widgetsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => dashboard_widgetsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
