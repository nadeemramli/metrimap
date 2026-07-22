// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Alert_rulesMaxAggregateInputObjectSchema: z.ZodType<Prisma.Alert_rulesMaxAggregateInputType, Prisma.Alert_rulesMaxAggregateInputType> = z.object({
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
export const Alert_rulesMaxAggregateInputObjectZodSchema = z.object({
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
