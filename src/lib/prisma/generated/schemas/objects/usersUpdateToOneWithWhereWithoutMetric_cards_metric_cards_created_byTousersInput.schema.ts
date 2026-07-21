// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInput.schema'

export const usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_created_byTousersInput, Prisma.usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_created_byTousersInput> = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)])
}).strict();
export const usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema)])
}).strict();
