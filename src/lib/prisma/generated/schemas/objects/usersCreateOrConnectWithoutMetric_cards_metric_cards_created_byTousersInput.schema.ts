// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersCreateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInput.schema'

export const usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInput, Prisma.usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInput> = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)])
}).strict();
export const usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)])
}).strict();
