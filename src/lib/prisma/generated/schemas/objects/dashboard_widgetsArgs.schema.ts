// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { dashboard_widgetsSelectObjectSchema } from './dashboard_widgetsSelect.schema';
import { dashboard_widgetsIncludeObjectSchema } from './dashboard_widgetsInclude.schema'

export const dashboard_widgetsArgsObjectSchema = z.object({
  select: z.lazy(() => dashboard_widgetsSelectObjectSchema).optional(),
  include: z.lazy(() => dashboard_widgetsIncludeObjectSchema).optional()
}).strict();
export const dashboard_widgetsArgsObjectZodSchema = z.object({
  select: z.lazy(() => dashboard_widgetsSelectObjectSchema).optional(),
  include: z.lazy(() => dashboard_widgetsIncludeObjectSchema).optional()
}).strict();
