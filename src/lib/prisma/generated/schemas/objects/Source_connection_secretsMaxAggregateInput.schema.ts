// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Source_connection_secretsMaxAggregateInputObjectSchema: z.ZodType<Prisma.Source_connection_secretsMaxAggregateInputType, Prisma.Source_connection_secretsMaxAggregateInputType> = z.object({
  connection_id: z.literal(true).optional(),
  password: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const Source_connection_secretsMaxAggregateInputObjectZodSchema = z.object({
  connection_id: z.literal(true).optional(),
  password: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
