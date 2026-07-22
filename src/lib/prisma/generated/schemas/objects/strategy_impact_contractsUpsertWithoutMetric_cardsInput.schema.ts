// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsUpdateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUpdateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsCreateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsWhereInputObjectSchema } from './strategy_impact_contractsWhereInput.schema'

export const strategy_impact_contractsUpsertWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUpsertWithoutMetric_cardsInput, Prisma.strategy_impact_contractsUpsertWithoutMetric_cardsInput> = z.object({
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]),
  where: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional()
}).strict();
export const strategy_impact_contractsUpsertWithoutMetric_cardsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]),
  where: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional()
}).strict();
