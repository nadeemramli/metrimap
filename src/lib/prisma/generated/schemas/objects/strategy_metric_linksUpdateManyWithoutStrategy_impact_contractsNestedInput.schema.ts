// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksCreateWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksUpsertWithWhereUniqueWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksUpsertWithWhereUniqueWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelopeObjectSchema } from './strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelope.schema';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema';
import { strategy_metric_linksUpdateWithWhereUniqueWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksUpdateWithWhereUniqueWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksUpdateManyWithWhereWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksUpdateManyWithWhereWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksScalarWhereInputObjectSchema } from './strategy_metric_linksScalarWhereInput.schema'

export const strategy_metric_linksUpdateManyWithoutStrategy_impact_contractsNestedInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUpdateManyWithoutStrategy_impact_contractsNestedInput, Prisma.strategy_metric_linksUpdateManyWithoutStrategy_impact_contractsNestedInput> = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema), z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const strategy_metric_linksUpdateManyWithoutStrategy_impact_contractsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutStrategy_impact_contractsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema), z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array()]).optional()
}).strict();
