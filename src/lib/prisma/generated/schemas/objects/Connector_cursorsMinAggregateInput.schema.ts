// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Connector_cursorsMinAggregateInputObjectSchema: z.ZodType<Prisma.Connector_cursorsMinAggregateInputType, Prisma.Connector_cursorsMinAggregateInputType> = z.object({
  connected_account_id: z.literal(true).optional(),
  connector_id: z.literal(true).optional(),
  stream: z.literal(true).optional(),
  cursor: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const Connector_cursorsMinAggregateInputObjectZodSchema = z.object({
  connected_account_id: z.literal(true).optional(),
  connector_id: z.literal(true).optional(),
  stream: z.literal(true).optional(),
  cursor: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
