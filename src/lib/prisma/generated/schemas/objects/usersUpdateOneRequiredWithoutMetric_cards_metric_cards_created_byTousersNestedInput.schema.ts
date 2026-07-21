// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersCreateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersUpsertWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUpsertWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInput.schema'

export const usersUpdateOneRequiredWithoutMetric_cards_metric_cards_created_byTousersNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneRequiredWithoutMetric_cards_metric_cards_created_byTousersNestedInput, Prisma.usersUpdateOneRequiredWithoutMetric_cards_metric_cards_created_byTousersNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneRequiredWithoutMetric_cards_metric_cards_created_byTousersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)]).optional()
}).strict();
