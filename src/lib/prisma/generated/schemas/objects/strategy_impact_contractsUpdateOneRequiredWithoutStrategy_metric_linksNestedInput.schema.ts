// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsCreateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsCreateWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsCreateOrConnectWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsUpsertWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUpsertWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsWhereUniqueInputObjectSchema } from './strategy_impact_contractsWhereUniqueInput.schema';
import { strategy_impact_contractsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUpdateToOneWithWhereWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsUpdateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUpdateWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInput.schema'

export const strategy_impact_contractsUpdateOneRequiredWithoutStrategy_metric_linksNestedInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUpdateOneRequiredWithoutStrategy_metric_linksNestedInput, Prisma.strategy_impact_contractsUpdateOneRequiredWithoutStrategy_metric_linksNestedInput> = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  upsert: z.lazy(() => strategy_impact_contractsUpsertWithoutStrategy_metric_linksInputObjectSchema).optional(),
  connect: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]).optional()
}).strict();
export const strategy_impact_contractsUpdateOneRequiredWithoutStrategy_metric_linksNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  upsert: z.lazy(() => strategy_impact_contractsUpsertWithoutStrategy_metric_linksInputObjectSchema).optional(),
  connect: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]).optional()
}).strict();
