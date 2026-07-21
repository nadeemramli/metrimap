// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsCreateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsWhereUniqueInputObjectSchema } from './strategy_impact_contractsWhereUniqueInput.schema'

export const strategy_impact_contractsCreateNestedOneWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsCreateNestedOneWithoutMetric_cardsInput, Prisma.strategy_impact_contractsCreateNestedOneWithoutMetric_cardsInput> = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  connect: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).optional()
}).strict();
export const strategy_impact_contractsCreateNestedOneWithoutMetric_cardsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  connect: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).optional()
}).strict();
