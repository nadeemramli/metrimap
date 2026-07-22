// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsWhereUniqueInputObjectSchema } from './strategy_impact_contractsWhereUniqueInput.schema';
import { strategy_impact_contractsUpdateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUpdateWithoutProjectsInput.schema';
import { strategy_impact_contractsUncheckedUpdateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUncheckedUpdateWithoutProjectsInput.schema';
import { strategy_impact_contractsCreateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsCreateWithoutProjectsInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutProjectsInput.schema'

export const strategy_impact_contractsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUpsertWithWhereUniqueWithoutProjectsInput, Prisma.strategy_impact_contractsUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const strategy_impact_contractsUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
