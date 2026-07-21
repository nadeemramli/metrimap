// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsArgsObjectSchema } from './connected_accountsArgs.schema'

export const connector_cursorsIncludeObjectSchema: z.ZodType<Prisma.connector_cursorsInclude, Prisma.connector_cursorsInclude> = z.object({
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
export const connector_cursorsIncludeObjectZodSchema = z.object({
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
