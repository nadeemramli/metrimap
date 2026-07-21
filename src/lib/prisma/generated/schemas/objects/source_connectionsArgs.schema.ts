// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connectionsSelectObjectSchema } from './source_connectionsSelect.schema';
import { source_connectionsIncludeObjectSchema } from './source_connectionsInclude.schema'

export const source_connectionsArgsObjectSchema = z.object({
  select: z.lazy(() => source_connectionsSelectObjectSchema).optional(),
  include: z.lazy(() => source_connectionsIncludeObjectSchema).optional()
}).strict();
export const source_connectionsArgsObjectZodSchema = z.object({
  select: z.lazy(() => source_connectionsSelectObjectSchema).optional(),
  include: z.lazy(() => source_connectionsIncludeObjectSchema).optional()
}).strict();
