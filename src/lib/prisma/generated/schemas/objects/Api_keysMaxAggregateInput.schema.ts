// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Api_keysMaxAggregateInputObjectSchema: z.ZodType<Prisma.Api_keysMaxAggregateInputType, Prisma.Api_keysMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  name: z.literal(true).optional(),
  key_prefix: z.literal(true).optional(),
  key_hash: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  last_used_at: z.literal(true).optional()
}).strict();
export const Api_keysMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  name: z.literal(true).optional(),
  key_prefix: z.literal(true).optional(),
  key_hash: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  last_used_at: z.literal(true).optional()
}).strict();
