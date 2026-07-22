// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsWhereUniqueInputObjectSchema } from './strategy_impact_contractsWhereUniqueInput.schema';
import { strategy_impact_contractsUpdateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUpdateWithoutProjectsInput.schema';
import { strategy_impact_contractsUncheckedUpdateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUncheckedUpdateWithoutProjectsInput.schema'

export const strategy_impact_contractsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUpdateWithWhereUniqueWithoutProjectsInput, Prisma.strategy_impact_contractsUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const strategy_impact_contractsUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
