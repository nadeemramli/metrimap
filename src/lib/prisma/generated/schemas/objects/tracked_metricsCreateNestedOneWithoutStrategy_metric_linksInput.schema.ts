// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsCreateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema'

export const tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInput, Prisma.tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInput> = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional()
}).strict();
export const tracked_metricsCreateNestedOneWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional()
}).strict();
