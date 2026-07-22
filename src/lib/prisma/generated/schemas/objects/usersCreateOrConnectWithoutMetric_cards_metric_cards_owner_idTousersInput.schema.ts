// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema'

export const usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema: z.ZodType<Prisma.usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInput, Prisma.usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInput> = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)])
}).strict();
export const usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)])
}).strict();
