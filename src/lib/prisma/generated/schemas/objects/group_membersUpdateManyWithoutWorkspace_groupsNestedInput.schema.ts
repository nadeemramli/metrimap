// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersCreateWithoutWorkspace_groupsInputObjectSchema } from './group_membersCreateWithoutWorkspace_groupsInput.schema';
import { group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema } from './group_membersUncheckedCreateWithoutWorkspace_groupsInput.schema';
import { group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema } from './group_membersCreateOrConnectWithoutWorkspace_groupsInput.schema';
import { group_membersUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema } from './group_membersUpsertWithWhereUniqueWithoutWorkspace_groupsInput.schema';
import { group_membersCreateManyWorkspace_groupsInputEnvelopeObjectSchema } from './group_membersCreateManyWorkspace_groupsInputEnvelope.schema';
import { group_membersWhereUniqueInputObjectSchema } from './group_membersWhereUniqueInput.schema';
import { group_membersUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema } from './group_membersUpdateWithWhereUniqueWithoutWorkspace_groupsInput.schema';
import { group_membersUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema } from './group_membersUpdateManyWithWhereWithoutWorkspace_groupsInput.schema';
import { group_membersScalarWhereInputObjectSchema } from './group_membersScalarWhereInput.schema'

export const group_membersUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema: z.ZodType<Prisma.group_membersUpdateManyWithoutWorkspace_groupsNestedInput, Prisma.group_membersUpdateManyWithoutWorkspace_groupsNestedInput> = z.object({
  create: z.union([z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => group_membersUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => group_membersCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => group_membersWhereUniqueInputObjectSchema), z.lazy(() => group_membersWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => group_membersWhereUniqueInputObjectSchema), z.lazy(() => group_membersWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => group_membersWhereUniqueInputObjectSchema), z.lazy(() => group_membersWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => group_membersWhereUniqueInputObjectSchema), z.lazy(() => group_membersWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => group_membersUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => group_membersUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => group_membersScalarWhereInputObjectSchema), z.lazy(() => group_membersScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const group_membersUpdateManyWithoutWorkspace_groupsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => group_membersUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => group_membersCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => group_membersWhereUniqueInputObjectSchema), z.lazy(() => group_membersWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => group_membersWhereUniqueInputObjectSchema), z.lazy(() => group_membersWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => group_membersWhereUniqueInputObjectSchema), z.lazy(() => group_membersWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => group_membersWhereUniqueInputObjectSchema), z.lazy(() => group_membersWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => group_membersUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => group_membersUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => group_membersScalarWhereInputObjectSchema), z.lazy(() => group_membersScalarWhereInputObjectSchema).array()]).optional()
}).strict();
