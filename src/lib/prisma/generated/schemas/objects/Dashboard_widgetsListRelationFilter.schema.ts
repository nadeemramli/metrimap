// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { dashboard_widgetsWhereInputObjectSchema } from './dashboard_widgetsWhereInput.schema'

export const Dashboard_widgetsListRelationFilterObjectSchema: z.ZodType<Prisma.Dashboard_widgetsListRelationFilter, Prisma.Dashboard_widgetsListRelationFilter> = z.object({
  every: z.lazy(() => dashboard_widgetsWhereInputObjectSchema).optional(),
  some: z.lazy(() => dashboard_widgetsWhereInputObjectSchema).optional(),
  none: z.lazy(() => dashboard_widgetsWhereInputObjectSchema).optional()
}).strict();
export const Dashboard_widgetsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => dashboard_widgetsWhereInputObjectSchema).optional(),
  some: z.lazy(() => dashboard_widgetsWhereInputObjectSchema).optional(),
  none: z.lazy(() => dashboard_widgetsWhereInputObjectSchema).optional()
}).strict();
