// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsCreateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsUpsertWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUpsertWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema';
import { tracked_metricsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUpdateToOneWithWhereWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsUpdateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUpdateWithoutStrategy_metric_linksInput.schema';
import { tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInput.schema'

export const tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInput, Prisma.tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInput> = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  upsert: z.lazy(() => tracked_metricsUpsertWithoutStrategy_metric_linksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tracked_metricsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]).optional()
}).strict();
export const tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  upsert: z.lazy(() => tracked_metricsUpsertWithoutStrategy_metric_linksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tracked_metricsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]).optional()
}).strict();
