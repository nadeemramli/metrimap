// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsSelectObjectSchema } from './tracked_metricsSelect.schema';
import { tracked_metricsIncludeObjectSchema } from './tracked_metricsInclude.schema'

export const tracked_metricsArgsObjectSchema = z.object({
  select: z.lazy(() => tracked_metricsSelectObjectSchema).optional(),
  include: z.lazy(() => tracked_metricsIncludeObjectSchema).optional()
}).strict();
export const tracked_metricsArgsObjectZodSchema = z.object({
  select: z.lazy(() => tracked_metricsSelectObjectSchema).optional(),
  include: z.lazy(() => tracked_metricsIncludeObjectSchema).optional()
}).strict();
