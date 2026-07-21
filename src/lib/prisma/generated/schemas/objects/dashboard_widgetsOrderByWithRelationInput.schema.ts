// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema'

export const dashboard_widgetsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsOrderByWithRelationInput, Prisma.dashboard_widgetsOrderByWithRelationInput> = z.object({
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
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const dashboard_widgetsOrderByWithRelationInputObjectZodSchema = z.object({
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
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional()
}).strict();
