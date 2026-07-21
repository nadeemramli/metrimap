// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsArgsObjectSchema } from './connected_accountsArgs.schema'

export const connected_account_secretsSelectObjectSchema: z.ZodType<Prisma.connected_account_secretsSelect, Prisma.connected_account_secretsSelect> = z.object({
  account_id: z.boolean().optional(),
  access_token: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  api_key: z.boolean().optional(),
  token_type: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
export const connected_account_secretsSelectObjectZodSchema = z.object({
  account_id: z.boolean().optional(),
  access_token: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  api_key: z.boolean().optional(),
  token_type: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
