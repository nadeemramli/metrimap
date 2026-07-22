// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutMetric_cards_metric_cards_owner_idTousersInput, Prisma.usersCreateNestedOneWithoutMetric_cards_metric_cards_owner_idTousersInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutMetric_cards_metric_cards_owner_idTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
