// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Tracked_metricsCountOutputTypeSelectObjectSchema } from './Tracked_metricsCountOutputTypeSelect.schema'

export const Tracked_metricsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => Tracked_metricsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const Tracked_metricsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => Tracked_metricsCountOutputTypeSelectObjectSchema).optional()
}).strict();
