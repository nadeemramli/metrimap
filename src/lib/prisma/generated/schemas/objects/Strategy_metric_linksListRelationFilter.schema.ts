// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksWhereInputObjectSchema } from './strategy_metric_linksWhereInput.schema'

export const Strategy_metric_linksListRelationFilterObjectSchema: z.ZodType<Prisma.Strategy_metric_linksListRelationFilter, Prisma.Strategy_metric_linksListRelationFilter> = z.object({
  every: z.lazy(() => strategy_metric_linksWhereInputObjectSchema).optional(),
  some: z.lazy(() => strategy_metric_linksWhereInputObjectSchema).optional(),
  none: z.lazy(() => strategy_metric_linksWhereInputObjectSchema).optional()
}).strict();
export const Strategy_metric_linksListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => strategy_metric_linksWhereInputObjectSchema).optional(),
  some: z.lazy(() => strategy_metric_linksWhereInputObjectSchema).optional(),
  none: z.lazy(() => strategy_metric_linksWhereInputObjectSchema).optional()
}).strict();
