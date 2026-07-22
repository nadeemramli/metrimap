// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_account_secretsSelectObjectSchema } from './connected_account_secretsSelect.schema';
import { connected_account_secretsIncludeObjectSchema } from './connected_account_secretsInclude.schema'

export const connected_account_secretsArgsObjectSchema = z.object({
  select: z.lazy(() => connected_account_secretsSelectObjectSchema).optional(),
  include: z.lazy(() => connected_account_secretsIncludeObjectSchema).optional()
}).strict();
export const connected_account_secretsArgsObjectZodSchema = z.object({
  select: z.lazy(() => connected_account_secretsSelectObjectSchema).optional(),
  include: z.lazy(() => connected_account_secretsIncludeObjectSchema).optional()
}).strict();
