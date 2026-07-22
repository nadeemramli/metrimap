// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Tracked_metricsMinAggregateInputObjectSchema: z.ZodType<Prisma.Tracked_metricsMinAggregateInputType, Prisma.Tracked_metricsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  name: z.literal(true).optional(),
  unit: z.literal(true).optional(),
  formula: z.literal(true).optional(),
  owner_label: z.literal(true).optional(),
  state: z.literal(true).optional(),
  origin_card_id: z.literal(true).optional(),
  origin_project_id: z.literal(true).optional(),
  source_kind: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  workspace_id: z.literal(true).optional()
}).strict();
export const Tracked_metricsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  name: z.literal(true).optional(),
  unit: z.literal(true).optional(),
  formula: z.literal(true).optional(),
  owner_label: z.literal(true).optional(),
  state: z.literal(true).optional(),
  origin_card_id: z.literal(true).optional(),
  origin_project_id: z.literal(true).optional(),
  source_kind: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  workspace_id: z.literal(true).optional()
}).strict();
