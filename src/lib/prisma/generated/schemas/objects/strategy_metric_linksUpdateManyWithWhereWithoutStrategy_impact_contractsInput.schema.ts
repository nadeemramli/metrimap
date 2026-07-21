// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksScalarWhereInputObjectSchema } from './strategy_metric_linksScalarWhereInput.schema';
import { strategy_metric_linksUpdateManyMutationInputObjectSchema } from './strategy_metric_linksUpdateManyMutationInput.schema';
import { strategy_metric_linksUncheckedUpdateManyWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksUncheckedUpdateManyWithoutStrategy_impact_contractsInput.schema'

export const strategy_metric_linksUpdateManyWithWhereWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUpdateManyWithWhereWithoutStrategy_impact_contractsInput, Prisma.strategy_metric_linksUpdateManyWithWhereWithoutStrategy_impact_contractsInput> = z.object({
  where: z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => strategy_metric_linksUpdateManyMutationInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateManyWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
export const strategy_metric_linksUpdateManyWithWhereWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => strategy_metric_linksUpdateManyMutationInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateManyWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
