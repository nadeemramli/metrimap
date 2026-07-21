// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_runsCreateWithoutConnected_accountsInputObjectSchema } from './connector_runsCreateWithoutConnected_accountsInput.schema';
import { connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connector_runsUncheckedCreateWithoutConnected_accountsInput.schema';
import { connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema } from './connector_runsCreateOrConnectWithoutConnected_accountsInput.schema';
import { connector_runsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema } from './connector_runsUpsertWithWhereUniqueWithoutConnected_accountsInput.schema';
import { connector_runsCreateManyConnected_accountsInputEnvelopeObjectSchema } from './connector_runsCreateManyConnected_accountsInputEnvelope.schema';
import { connector_runsWhereUniqueInputObjectSchema } from './connector_runsWhereUniqueInput.schema';
import { connector_runsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema } from './connector_runsUpdateWithWhereUniqueWithoutConnected_accountsInput.schema';
import { connector_runsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema } from './connector_runsUpdateManyWithWhereWithoutConnected_accountsInput.schema';
import { connector_runsScalarWhereInputObjectSchema } from './connector_runsScalarWhereInput.schema'

export const connector_runsUpdateManyWithoutConnected_accountsNestedInputObjectSchema: z.ZodType<Prisma.connector_runsUpdateManyWithoutConnected_accountsNestedInput, Prisma.connector_runsUpdateManyWithoutConnected_accountsNestedInput> = z.object({
  create: z.union([z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => connector_runsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => connector_runsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => connector_runsWhereUniqueInputObjectSchema), z.lazy(() => connector_runsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => connector_runsWhereUniqueInputObjectSchema), z.lazy(() => connector_runsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => connector_runsWhereUniqueInputObjectSchema), z.lazy(() => connector_runsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => connector_runsWhereUniqueInputObjectSchema), z.lazy(() => connector_runsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => connector_runsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => connector_runsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => connector_runsScalarWhereInputObjectSchema), z.lazy(() => connector_runsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const connector_runsUpdateManyWithoutConnected_accountsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => connector_runsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => connector_runsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => connector_runsWhereUniqueInputObjectSchema), z.lazy(() => connector_runsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => connector_runsWhereUniqueInputObjectSchema), z.lazy(() => connector_runsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => connector_runsWhereUniqueInputObjectSchema), z.lazy(() => connector_runsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => connector_runsWhereUniqueInputObjectSchema), z.lazy(() => connector_runsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => connector_runsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => connector_runsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => connector_runsScalarWhereInputObjectSchema), z.lazy(() => connector_runsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
