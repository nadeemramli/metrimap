// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historySelectObjectSchema } from './relationship_historySelect.schema';
import { relationship_historyIncludeObjectSchema } from './relationship_historyInclude.schema'

export const relationship_historyArgsObjectSchema = z.object({
  select: z.lazy(() => relationship_historySelectObjectSchema).optional(),
  include: z.lazy(() => relationship_historyIncludeObjectSchema).optional()
}).strict();
export const relationship_historyArgsObjectZodSchema = z.object({
  select: z.lazy(() => relationship_historySelectObjectSchema).optional(),
  include: z.lazy(() => relationship_historyIncludeObjectSchema).optional()
}).strict();
