// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema';
import { tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsCreateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInput.schema'

export const tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInput, Prisma.tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInput> = z.object({
  where: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)])
}).strict();
export const tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  where: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)])
}).strict();
