// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesWhereInputObjectSchema } from './alert_rulesWhereInput.schema'

export const Alert_rulesListRelationFilterObjectSchema: z.ZodType<Prisma.Alert_rulesListRelationFilter, Prisma.Alert_rulesListRelationFilter> = z.object({
  every: z.lazy(() => alert_rulesWhereInputObjectSchema).optional(),
  some: z.lazy(() => alert_rulesWhereInputObjectSchema).optional(),
  none: z.lazy(() => alert_rulesWhereInputObjectSchema).optional()
}).strict();
export const Alert_rulesListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => alert_rulesWhereInputObjectSchema).optional(),
  some: z.lazy(() => alert_rulesWhereInputObjectSchema).optional(),
  none: z.lazy(() => alert_rulesWhereInputObjectSchema).optional()
}).strict();
