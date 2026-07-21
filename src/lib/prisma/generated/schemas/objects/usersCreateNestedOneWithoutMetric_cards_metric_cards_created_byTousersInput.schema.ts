// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersCreateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutMetric_cards_metric_cards_created_byTousersInput, Prisma.usersCreateNestedOneWithoutMetric_cards_metric_cards_created_byTousersInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutMetric_cards_metric_cards_created_byTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
