// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Source_connectionsMinAggregateInputObjectSchema: z.ZodType<Prisma.Source_connectionsMinAggregateInputType, Prisma.Source_connectionsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  name: z.literal(true).optional(),
  warehouse_type: z.literal(true).optional(),
  host: z.literal(true).optional(),
  port: z.literal(true).optional(),
  database: z.literal(true).optional(),
  username: z.literal(true).optional(),
  ssl: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  workspace_id: z.literal(true).optional()
}).strict();
export const Source_connectionsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  name: z.literal(true).optional(),
  warehouse_type: z.literal(true).optional(),
  host: z.literal(true).optional(),
  port: z.literal(true).optional(),
  database: z.literal(true).optional(),
  username: z.literal(true).optional(),
  ssl: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  workspace_id: z.literal(true).optional()
}).strict();
