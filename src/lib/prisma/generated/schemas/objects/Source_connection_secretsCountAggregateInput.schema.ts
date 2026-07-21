// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Source_connection_secretsCountAggregateInputObjectSchema: z.ZodType<Prisma.Source_connection_secretsCountAggregateInputType, Prisma.Source_connection_secretsCountAggregateInputType> = z.object({
  connection_id: z.literal(true).optional(),
  password: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Source_connection_secretsCountAggregateInputObjectZodSchema = z.object({
  connection_id: z.literal(true).optional(),
  password: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
