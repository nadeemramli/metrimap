// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsArgsObjectSchema } from './connected_accountsArgs.schema'

export const connector_runsIncludeObjectSchema: z.ZodType<Prisma.connector_runsInclude, Prisma.connector_runsInclude> = z.object({
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
export const connector_runsIncludeObjectZodSchema = z.object({
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional()
}).strict();
