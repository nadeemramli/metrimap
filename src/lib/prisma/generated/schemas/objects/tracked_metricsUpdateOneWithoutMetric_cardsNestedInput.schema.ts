// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsCreateWithoutMetric_cardsInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_cardsInput.schema';
import { tracked_metricsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './tracked_metricsCreateOrConnectWithoutMetric_cardsInput.schema';
import { tracked_metricsUpsertWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUpsertWithoutMetric_cardsInput.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema';
import { tracked_metricsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUpdateToOneWithWhereWithoutMetric_cardsInput.schema';
import { tracked_metricsUpdateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUpdateWithoutMetric_cardsInput.schema';
import { tracked_metricsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutMetric_cardsInput.schema'

export const tracked_metricsUpdateOneWithoutMetric_cardsNestedInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateOneWithoutMetric_cardsNestedInput, Prisma.tracked_metricsUpdateOneWithoutMetric_cardsNestedInput> = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  upsert: z.lazy(() => tracked_metricsUpsertWithoutMetric_cardsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tracked_metricsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]).optional()
}).strict();
export const tracked_metricsUpdateOneWithoutMetric_cardsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  upsert: z.lazy(() => tracked_metricsUpsertWithoutMetric_cardsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tracked_metricsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]).optional()
}).strict();
