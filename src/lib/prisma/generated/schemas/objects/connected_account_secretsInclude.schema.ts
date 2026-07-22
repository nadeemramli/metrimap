// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsArgsObjectSchema } from './connected_accountsArgs.schema'

export const connected_account_secretsIncludeObjectSchema: z.ZodType<Prisma.connected_account_secretsInclude, Prisma.connected_account_secretsInclude> = z.object({
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
export const connected_account_secretsIncludeObjectZodSchema = z.object({
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
