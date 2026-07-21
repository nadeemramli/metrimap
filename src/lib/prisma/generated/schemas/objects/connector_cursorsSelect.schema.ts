// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsArgsObjectSchema } from './connected_accountsArgs.schema'

export const connector_cursorsSelectObjectSchema: z.ZodType<Prisma.connector_cursorsSelect, Prisma.connector_cursorsSelect> = z.object({
  connected_account_id: z.boolean().optional(),
  connector_id: z.boolean().optional(),
  stream: z.boolean().optional(),
  cursor: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
export const connector_cursorsSelectObjectZodSchema = z.object({
  connected_account_id: z.boolean().optional(),
  connector_id: z.boolean().optional(),
  stream: z.boolean().optional(),
  cursor: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
