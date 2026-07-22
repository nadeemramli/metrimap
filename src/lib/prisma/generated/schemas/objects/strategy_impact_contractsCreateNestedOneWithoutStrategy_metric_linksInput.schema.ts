// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsCreateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsCreateWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsCreateOrConnectWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsWhereUniqueInputObjectSchema } from './strategy_impact_contractsWhereUniqueInput.schema'

export const strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInput, Prisma.strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInput> = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  connect: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).optional()
}).strict();
export const strategy_impact_contractsCreateNestedOneWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  connect: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).optional()
}).strict();
