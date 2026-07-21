// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema';
import { tracked_metricsUpdateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUpdateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInput.schema'

export const tracked_metricsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateToOneWithWhereWithoutStrategy_metric_linksInput, Prisma.tracked_metricsUpdateToOneWithWhereWithoutStrategy_metric_linksInput> = z.object({
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tracked_metricsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)])
}).strict();
export const tracked_metricsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tracked_metricsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)])
}).strict();
