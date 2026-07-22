// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_valuesSelectObjectSchema } from './metric_valuesSelect.schema';
import { metric_valuesIncludeObjectSchema } from './metric_valuesInclude.schema'

export const metric_valuesArgsObjectSchema = z.object({
  select: z.lazy(() => metric_valuesSelectObjectSchema).optional(),
  include: z.lazy(() => metric_valuesIncludeObjectSchema).optional()
}).strict();
export const metric_valuesArgsObjectZodSchema = z.object({
  select: z.lazy(() => metric_valuesSelectObjectSchema).optional(),
  include: z.lazy(() => metric_valuesIncludeObjectSchema).optional()
}).strict();
