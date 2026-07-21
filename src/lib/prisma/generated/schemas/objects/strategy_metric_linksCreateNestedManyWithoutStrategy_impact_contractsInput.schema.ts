// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksCreateWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelopeObjectSchema } from './strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelope.schema';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema'

export const strategy_metric_linksCreateNestedManyWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateNestedManyWithoutStrategy_impact_contractsInput, Prisma.strategy_metric_linksCreateNestedManyWithoutStrategy_impact_contractsInput> = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const strategy_metric_linksCreateNestedManyWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
