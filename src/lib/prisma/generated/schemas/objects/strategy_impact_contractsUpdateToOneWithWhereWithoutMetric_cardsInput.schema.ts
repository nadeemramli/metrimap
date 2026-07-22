// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsWhereInputObjectSchema } from './strategy_impact_contractsWhereInput.schema';
import { strategy_impact_contractsUpdateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUpdateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInput.schema'

export const strategy_impact_contractsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUpdateToOneWithWhereWithoutMetric_cardsInput, Prisma.strategy_impact_contractsUpdateToOneWithWhereWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const strategy_impact_contractsUpdateToOneWithWhereWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
