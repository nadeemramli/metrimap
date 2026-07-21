// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateNestedOneWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsCreateNestedOneWithoutConnected_account_secretsInput.schema'

export const connected_account_secretsCreateInputObjectSchema: z.ZodType<Prisma.connected_account_secretsCreateInput, Prisma.connected_account_secretsCreateInput> = z.object({
  access_token: z.string().optional().nullable(),
  refresh_token: z.string().optional().nullable(),
  api_key: z.string().optional().nullable(),
  token_type: z.string().optional().nullable(),
  expires_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  connected_accounts: z.lazy(() => connected_accountsCreateNestedOneWithoutConnected_account_secretsInputObjectSchema)
}).strict();
export const connected_account_secretsCreateInputObjectZodSchema = z.object({
  access_token: z.string().optional().nullable(),
  refresh_token: z.string().optional().nullable(),
  api_key: z.string().optional().nullable(),
  token_type: z.string().optional().nullable(),
  expires_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  connected_accounts: z.lazy(() => connected_accountsCreateNestedOneWithoutConnected_account_secretsInputObjectSchema)
}).strict();
