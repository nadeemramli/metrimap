// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Node_access_grantsCountAggregateInputObjectSchema: z.ZodType<Prisma.Node_access_grantsCountAggregateInputType, Prisma.Node_access_grantsCountAggregateInputType> = z.object({
  metric_card_id: z.literal(true).optional(),
  group_id: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Node_access_grantsCountAggregateInputObjectZodSchema = z.object({
  metric_card_id: z.literal(true).optional(),
  group_id: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
