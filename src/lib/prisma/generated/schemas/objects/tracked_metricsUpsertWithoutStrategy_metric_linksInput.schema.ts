// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsUpdateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUpdateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsCreateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema'

export const tracked_metricsUpsertWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpsertWithoutStrategy_metric_linksInput, Prisma.tracked_metricsUpsertWithoutStrategy_metric_linksInput> = z.object({
  update: z.union([z.lazy(() => tracked_metricsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]),
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
export const tracked_metricsUpsertWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => tracked_metricsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]),
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
