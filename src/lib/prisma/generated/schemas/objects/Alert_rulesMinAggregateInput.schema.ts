// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Alert_rulesMinAggregateInputObjectSchema: z.ZodType<Prisma.Alert_rulesMinAggregateInputType, Prisma.Alert_rulesMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  card_id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  rule_type: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  last_triggered_at: z.literal(true).optional(),
  last_triggered_value: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const Alert_rulesMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  card_id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  rule_type: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  last_triggered_at: z.literal(true).optional(),
  last_triggered_value: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
