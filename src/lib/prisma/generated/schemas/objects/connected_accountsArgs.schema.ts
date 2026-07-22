// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsSelectObjectSchema } from './connected_accountsSelect.schema';
import { connected_accountsIncludeObjectSchema } from './connected_accountsInclude.schema'

export const connected_accountsArgsObjectSchema = z.object({
  select: z.lazy(() => connected_accountsSelectObjectSchema).optional(),
  include: z.lazy(() => connected_accountsIncludeObjectSchema).optional()
}).strict();
export const connected_accountsArgsObjectZodSchema = z.object({
  select: z.lazy(() => connected_accountsSelectObjectSchema).optional(),
  include: z.lazy(() => connected_accountsIncludeObjectSchema).optional()
}).strict();
