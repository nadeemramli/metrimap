// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Dashboard_widgetsMinAggregateInputObjectSchema: z.ZodType<Prisma.Dashboard_widgetsMinAggregateInputType, Prisma.Dashboard_widgetsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  widget_type: z.literal(true).optional(),
  sort_index: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  group_id: z.literal(true).optional()
}).strict();
export const Dashboard_widgetsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  widget_type: z.literal(true).optional(),
  sort_index: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  group_id: z.literal(true).optional()
}).strict();
