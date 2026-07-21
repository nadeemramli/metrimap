// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_cursorsCreateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsCreateWithoutConnected_accountsInput.schema';
import { connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUncheckedCreateWithoutConnected_accountsInput.schema';
import { connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema } from './connector_cursorsCreateOrConnectWithoutConnected_accountsInput.schema';
import { connector_cursorsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUpsertWithWhereUniqueWithoutConnected_accountsInput.schema';
import { connector_cursorsCreateManyConnected_accountsInputEnvelopeObjectSchema } from './connector_cursorsCreateManyConnected_accountsInputEnvelope.schema';
import { connector_cursorsWhereUniqueInputObjectSchema } from './connector_cursorsWhereUniqueInput.schema';
import { connector_cursorsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUpdateWithWhereUniqueWithoutConnected_accountsInput.schema';
import { connector_cursorsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUpdateManyWithWhereWithoutConnected_accountsInput.schema';
import { connector_cursorsScalarWhereInputObjectSchema } from './connector_cursorsScalarWhereInput.schema'

export const connector_cursorsUpdateManyWithoutConnected_accountsNestedInputObjectSchema: z.ZodType<Prisma.connector_cursorsUpdateManyWithoutConnected_accountsNestedInput, Prisma.connector_cursorsUpdateManyWithoutConnected_accountsNestedInput> = z.object({
  create: z.union([z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => connector_cursorsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => connector_cursorsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema), z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema), z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema), z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema), z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => connector_cursorsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => connector_cursorsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => connector_cursorsScalarWhereInputObjectSchema), z.lazy(() => connector_cursorsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const connector_cursorsUpdateManyWithoutConnected_accountsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => connector_cursorsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => connector_cursorsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema), z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema), z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema), z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema), z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => connector_cursorsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => connector_cursorsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => connector_cursorsScalarWhereInputObjectSchema), z.lazy(() => connector_cursorsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
