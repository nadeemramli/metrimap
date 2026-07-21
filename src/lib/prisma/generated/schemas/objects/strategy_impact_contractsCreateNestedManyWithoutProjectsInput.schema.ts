// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsCreateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsCreateWithoutProjectsInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutProjectsInput.schema';
import { strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema } from './strategy_impact_contractsCreateOrConnectWithoutProjectsInput.schema';
import { strategy_impact_contractsCreateManyProjectsInputEnvelopeObjectSchema } from './strategy_impact_contractsCreateManyProjectsInputEnvelope.schema';
import { strategy_impact_contractsWhereUniqueInputObjectSchema } from './strategy_impact_contractsWhereUniqueInput.schema'

export const strategy_impact_contractsCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsCreateNestedManyWithoutProjectsInput, Prisma.strategy_impact_contractsCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_impact_contractsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const strategy_impact_contractsCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => strategy_impact_contractsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_impact_contractsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema), z.lazy(() => strategy_impact_contractsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
