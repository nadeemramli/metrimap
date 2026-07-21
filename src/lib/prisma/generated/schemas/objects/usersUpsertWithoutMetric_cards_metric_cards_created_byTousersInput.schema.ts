// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersCreateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const usersUpsertWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersUpsertWithoutMetric_cards_metric_cards_created_byTousersInput, Prisma.usersUpsertWithoutMetric_cards_metric_cards_created_byTousersInput> = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const usersUpsertWithoutMetric_cards_metric_cards_created_byTousersInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
