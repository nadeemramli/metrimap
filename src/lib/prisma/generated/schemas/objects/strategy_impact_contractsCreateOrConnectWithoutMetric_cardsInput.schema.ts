// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsWhereUniqueInputObjectSchema } from './strategy_impact_contractsWhereUniqueInput.schema';
import { strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsCreateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInput.schema'

export const strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInput, Prisma.strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
