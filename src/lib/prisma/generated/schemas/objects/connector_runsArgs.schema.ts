// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_runsSelectObjectSchema } from './connector_runsSelect.schema';
import { connector_runsIncludeObjectSchema } from './connector_runsInclude.schema'

export const connector_runsArgsObjectSchema = z.object({
  select: z.lazy(() => connector_runsSelectObjectSchema).optional(),
  include: z.lazy(() => connector_runsIncludeObjectSchema).optional()
}).strict();
export const connector_runsArgsObjectZodSchema = z.object({
  select: z.lazy(() => connector_runsSelectObjectSchema).optional(),
  include: z.lazy(() => connector_runsIncludeObjectSchema).optional()
}).strict();
