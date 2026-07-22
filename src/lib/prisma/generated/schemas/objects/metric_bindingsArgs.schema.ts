// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsSelectObjectSchema } from './metric_bindingsSelect.schema';
import { metric_bindingsIncludeObjectSchema } from './metric_bindingsInclude.schema'

export const metric_bindingsArgsObjectSchema = z.object({
  select: z.lazy(() => metric_bindingsSelectObjectSchema).optional(),
  include: z.lazy(() => metric_bindingsIncludeObjectSchema).optional()
}).strict();
export const metric_bindingsArgsObjectZodSchema = z.object({
  select: z.lazy(() => metric_bindingsSelectObjectSchema).optional(),
  include: z.lazy(() => metric_bindingsIncludeObjectSchema).optional()
}).strict();
