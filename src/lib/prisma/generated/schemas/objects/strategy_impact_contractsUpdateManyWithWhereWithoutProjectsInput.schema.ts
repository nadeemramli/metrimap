// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsScalarWhereInputObjectSchema } from './strategy_impact_contractsScalarWhereInput.schema';
import { strategy_impact_contractsUpdateManyMutationInputObjectSchema } from './strategy_impact_contractsUpdateManyMutationInput.schema';
import { strategy_impact_contractsUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUncheckedUpdateManyWithoutProjectsInput.schema'

export const strategy_impact_contractsUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUpdateManyWithWhereWithoutProjectsInput, Prisma.strategy_impact_contractsUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => strategy_impact_contractsUpdateManyMutationInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const strategy_impact_contractsUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => strategy_impact_contractsUpdateManyMutationInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
