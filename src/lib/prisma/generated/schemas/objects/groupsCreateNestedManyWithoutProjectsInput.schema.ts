// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsCreateWithoutProjectsInputObjectSchema } from './groupsCreateWithoutProjectsInput.schema';
import { groupsUncheckedCreateWithoutProjectsInputObjectSchema } from './groupsUncheckedCreateWithoutProjectsInput.schema';
import { groupsCreateOrConnectWithoutProjectsInputObjectSchema } from './groupsCreateOrConnectWithoutProjectsInput.schema';
import { groupsCreateManyProjectsInputEnvelopeObjectSchema } from './groupsCreateManyProjectsInputEnvelope.schema';
import { groupsWhereUniqueInputObjectSchema } from './groupsWhereUniqueInput.schema'

export const groupsCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.groupsCreateNestedManyWithoutProjectsInput, Prisma.groupsCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => groupsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => groupsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => groupsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const groupsCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => groupsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => groupsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => groupsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
