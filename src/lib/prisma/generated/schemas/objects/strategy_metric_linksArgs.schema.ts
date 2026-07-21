// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksSelectObjectSchema } from './strategy_metric_linksSelect.schema';
import { strategy_metric_linksIncludeObjectSchema } from './strategy_metric_linksInclude.schema'

export const strategy_metric_linksArgsObjectSchema = z.object({
  select: z.lazy(() => strategy_metric_linksSelectObjectSchema).optional(),
  include: z.lazy(() => strategy_metric_linksIncludeObjectSchema).optional()
}).strict();
export const strategy_metric_linksArgsObjectZodSchema = z.object({
  select: z.lazy(() => strategy_metric_linksSelectObjectSchema).optional(),
  include: z.lazy(() => strategy_metric_linksIncludeObjectSchema).optional()
}).strict();
