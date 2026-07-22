// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsCreateWithoutWorkspace_groupsInput.schema';
import { node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUncheckedCreateWithoutWorkspace_groupsInput.schema';
import { node_access_grantsCreateOrConnectWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsCreateOrConnectWithoutWorkspace_groupsInput.schema';
import { node_access_grantsUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUpsertWithWhereUniqueWithoutWorkspace_groupsInput.schema';
import { node_access_grantsCreateManyWorkspace_groupsInputEnvelopeObjectSchema } from './node_access_grantsCreateManyWorkspace_groupsInputEnvelope.schema';
import { node_access_grantsWhereUniqueInputObjectSchema } from './node_access_grantsWhereUniqueInput.schema';
import { node_access_grantsUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUpdateWithWhereUniqueWithoutWorkspace_groupsInput.schema';
import { node_access_grantsUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUpdateManyWithWhereWithoutWorkspace_groupsInput.schema';
import { node_access_grantsScalarWhereInputObjectSchema } from './node_access_grantsScalarWhereInput.schema'

export const node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema: z.ZodType<Prisma.node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsNestedInput, Prisma.node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsNestedInput> = z.object({
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => node_access_grantsCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => node_access_grantsUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => node_access_grantsCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => node_access_grantsUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => node_access_grantsUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => node_access_grantsScalarWhereInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const node_access_grantsUncheckedUpdateManyWithoutWorkspace_groupsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => node_access_grantsCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => node_access_grantsUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => node_access_grantsCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => node_access_grantsUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => node_access_grantsUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => node_access_grantsScalarWhereInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
