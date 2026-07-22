// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const usersUpsertWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema: z.ZodType<Prisma.usersUpsertWithoutMetric_cards_metric_cards_owner_idTousersInput, Prisma.usersUpsertWithoutMetric_cards_metric_cards_owner_idTousersInput> = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const usersUpsertWithoutMetric_cards_metric_cards_owner_idTousersInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
