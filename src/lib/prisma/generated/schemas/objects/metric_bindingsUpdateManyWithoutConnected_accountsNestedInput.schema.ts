// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsCreateWithoutConnected_accountsInputObjectSchema } from './metric_bindingsCreateWithoutConnected_accountsInput.schema';
import { metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './metric_bindingsUncheckedCreateWithoutConnected_accountsInput.schema';
import { metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema } from './metric_bindingsCreateOrConnectWithoutConnected_accountsInput.schema';
import { metric_bindingsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema } from './metric_bindingsUpsertWithWhereUniqueWithoutConnected_accountsInput.schema';
import { metric_bindingsCreateManyConnected_accountsInputEnvelopeObjectSchema } from './metric_bindingsCreateManyConnected_accountsInputEnvelope.schema';
import { metric_bindingsWhereUniqueInputObjectSchema } from './metric_bindingsWhereUniqueInput.schema';
import { metric_bindingsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema } from './metric_bindingsUpdateWithWhereUniqueWithoutConnected_accountsInput.schema';
import { metric_bindingsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema } from './metric_bindingsUpdateManyWithWhereWithoutConnected_accountsInput.schema';
import { metric_bindingsScalarWhereInputObjectSchema } from './metric_bindingsScalarWhereInput.schema'

export const metric_bindingsUpdateManyWithoutConnected_accountsNestedInputObjectSchema: z.ZodType<Prisma.metric_bindingsUpdateManyWithoutConnected_accountsNestedInput, Prisma.metric_bindingsUpdateManyWithoutConnected_accountsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_bindingsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_bindingsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_bindingsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_bindingsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_bindingsScalarWhereInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const metric_bindingsUpdateManyWithoutConnected_accountsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_bindingsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_bindingsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_bindingsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_bindingsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_bindingsScalarWhereInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
