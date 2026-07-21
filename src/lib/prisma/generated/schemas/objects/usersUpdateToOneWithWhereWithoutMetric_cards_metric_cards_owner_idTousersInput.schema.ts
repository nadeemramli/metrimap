// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema'

export const usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema: z.ZodType<Prisma.usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_owner_idTousersInput, Prisma.usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_owner_idTousersInput> = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)])
}).strict();
export const usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_owner_idTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)])
}).strict();
