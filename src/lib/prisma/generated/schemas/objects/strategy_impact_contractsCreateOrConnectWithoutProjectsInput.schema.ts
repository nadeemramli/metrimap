// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsWhereUniqueInputObjectSchema } from './strategy_impact_contractsWhereUniqueInput.schema';
import { strategy_impact_contractsCreateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsCreateWithoutProjectsInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutProjectsInput.schema'

export const strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsCreateOrConnectWithoutProjectsInput, Prisma.strategy_impact_contractsCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
