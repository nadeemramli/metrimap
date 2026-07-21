// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Dashboard_widgetsCountAggregateInputObjectSchema: z.ZodType<Prisma.Dashboard_widgetsCountAggregateInputType, Prisma.Dashboard_widgetsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  widget_type: z.literal(true).optional(),
  config: z.literal(true).optional(),
  layout: z.literal(true).optional(),
  sort_index: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  group_id: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Dashboard_widgetsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  widget_type: z.literal(true).optional(),
  config: z.literal(true).optional(),
  layout: z.literal(true).optional(),
  sort_index: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  group_id: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
