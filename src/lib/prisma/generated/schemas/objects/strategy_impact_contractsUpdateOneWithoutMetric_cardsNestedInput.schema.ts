// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsCreateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsUpsertWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUpsertWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsWhereInputObjectSchema } from './strategy_impact_contractsWhereInput.schema';
import { strategy_impact_contractsWhereUniqueInputObjectSchema } from './strategy_impact_contractsWhereUniqueInput.schema';
import { strategy_impact_contractsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUpdateToOneWithWhereWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsUpdateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUpdateWithoutMetric_cardsInput.schema';
import { strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInput.schema'

export const strategy_impact_contractsUpdateOneWithoutMetric_cardsNestedInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUpdateOneWithoutMetric_cardsNestedInput, Prisma.strategy_impact_contractsUpdateOneWithoutMetric_cardsNestedInput> = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  upsert: z.lazy(() => strategy_impact_contractsUpsertWithoutMetric_cardsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]).optional()
}).strict();
export const strategy_impact_contractsUpdateOneWithoutMetric_cardsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  upsert: z.lazy(() => strategy_impact_contractsUpsertWithoutMetric_cardsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]).optional()
}).strict();
