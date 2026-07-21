// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Node_access_grantsMinAggregateInputObjectSchema: z.ZodType<Prisma.Node_access_grantsMinAggregateInputType, Prisma.Node_access_grantsMinAggregateInputType> = z.object({
  metric_card_id: z.literal(true).optional(),
  group_id: z.literal(true).optional()
}).strict();
export const Node_access_grantsMinAggregateInputObjectZodSchema = z.object({
  metric_card_id: z.literal(true).optional(),
  group_id: z.literal(true).optional()
}).strict();
