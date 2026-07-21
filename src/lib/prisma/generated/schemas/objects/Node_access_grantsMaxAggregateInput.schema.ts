// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Node_access_grantsMaxAggregateInputObjectSchema: z.ZodType<Prisma.Node_access_grantsMaxAggregateInputType, Prisma.Node_access_grantsMaxAggregateInputType> = z.object({
  metric_card_id: z.literal(true).optional(),
  group_id: z.literal(true).optional()
}).strict();
export const Node_access_grantsMaxAggregateInputObjectZodSchema = z.object({
  metric_card_id: z.literal(true).optional(),
  group_id: z.literal(true).optional()
}).strict();
