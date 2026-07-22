// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesSelectObjectSchema } from './alert_rulesSelect.schema';
import { alert_rulesIncludeObjectSchema } from './alert_rulesInclude.schema'

export const alert_rulesArgsObjectSchema = z.object({
  select: z.lazy(() => alert_rulesSelectObjectSchema).optional(),
  include: z.lazy(() => alert_rulesIncludeObjectSchema).optional()
}).strict();
export const alert_rulesArgsObjectZodSchema = z.object({
  select: z.lazy(() => alert_rulesSelectObjectSchema).optional(),
  include: z.lazy(() => alert_rulesIncludeObjectSchema).optional()
}).strict();
