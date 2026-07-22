// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsSelectObjectSchema } from './node_access_grantsSelect.schema';
import { node_access_grantsIncludeObjectSchema } from './node_access_grantsInclude.schema'

export const node_access_grantsArgsObjectSchema = z.object({
  select: z.lazy(() => node_access_grantsSelectObjectSchema).optional(),
  include: z.lazy(() => node_access_grantsIncludeObjectSchema).optional()
}).strict();
export const node_access_grantsArgsObjectZodSchema = z.object({
  select: z.lazy(() => node_access_grantsSelectObjectSchema).optional(),
  include: z.lazy(() => node_access_grantsIncludeObjectSchema).optional()
}).strict();
