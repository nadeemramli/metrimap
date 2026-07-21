// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const connected_account_secretsCreateManyInputObjectSchema: z.ZodType<Prisma.connected_account_secretsCreateManyInput, Prisma.connected_account_secretsCreateManyInput> = z.object({
  account_id: z.string(),
  access_token: z.string().optional().nullable(),
  refresh_token: z.string().optional().nullable(),
  api_key: z.string().optional().nullable(),
  token_type: z.string().optional().nullable(),
  expires_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const connected_account_secretsCreateManyInputObjectZodSchema = z.object({
  account_id: z.string(),
  access_token: z.string().optional().nullable(),
  refresh_token: z.string().optional().nullable(),
  api_key: z.string().optional().nullable(),
  token_type: z.string().optional().nullable(),
  expires_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
