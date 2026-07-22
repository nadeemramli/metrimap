// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsCreateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsCreateWithoutProjectsInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutProjectsInput.schema';
import { strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema } from './strategy_impact_contractsCreateOrConnectWithoutProjectsInput.schema';
import { strategy_impact_contractsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { strategy_impact_contractsCreateManyProjectsInputEnvelopeObjectSchema } from './strategy_impact_contractsCreateManyProjectsInputEnvelope.schema';
import { strategy_impact_contractsWhereUniqueInputObjectSchema } from './strategy_impact_contractsWhereUniqueInput.schema';
import { strategy_impact_contractsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { strategy_impact_contractsUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUpdateManyWithWhereWithoutProjectsInput.schema';
import { strategy_impact_contractsScalarWhereInputObjectSchema } from './strategy_impact_contractsScalarWhereInput.schema'

export const strategy_impact_contractsUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUpdateManyWithoutProjectsNestedInput, Prisma.strategy_impact_contractsUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => strategy_impact_contractsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_impact_contractsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => strategy_impact_contractsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema), z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const strategy_impact_contractsUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => strategy_impact_contractsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_impact_contractsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => strategy_impact_contractsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema), z.lazy(() => strategy_impact_contractsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
