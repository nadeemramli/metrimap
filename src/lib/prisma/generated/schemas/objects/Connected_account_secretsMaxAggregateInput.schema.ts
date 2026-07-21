// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Connected_account_secretsMaxAggregateInputObjectSchema: z.ZodType<Prisma.Connected_account_secretsMaxAggregateInputType, Prisma.Connected_account_secretsMaxAggregateInputType> = z.object({
  account_id: z.literal(true).optional(),
  access_token: z.literal(true).optional(),
  refresh_token: z.literal(true).optional(),
  api_key: z.literal(true).optional(),
  token_type: z.literal(true).optional(),
  expires_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const Connected_account_secretsMaxAggregateInputObjectZodSchema = z.object({
  account_id: z.literal(true).optional(),
  access_token: z.literal(true).optional(),
  refresh_token: z.literal(true).optional(),
  api_key: z.literal(true).optional(),
  token_type: z.literal(true).optional(),
  expires_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
