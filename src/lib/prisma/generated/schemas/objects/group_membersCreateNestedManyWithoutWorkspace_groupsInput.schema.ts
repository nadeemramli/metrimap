// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersCreateWithoutWorkspace_groupsInputObjectSchema } from './group_membersCreateWithoutWorkspace_groupsInput.schema';
import { group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema } from './group_membersUncheckedCreateWithoutWorkspace_groupsInput.schema';
import { group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema } from './group_membersCreateOrConnectWithoutWorkspace_groupsInput.schema';
import { group_membersCreateManyWorkspace_groupsInputEnvelopeObjectSchema } from './group_membersCreateManyWorkspace_groupsInputEnvelope.schema';
import { group_membersWhereUniqueInputObjectSchema } from './group_membersWhereUniqueInput.schema'

export const group_membersCreateNestedManyWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.group_membersCreateNestedManyWithoutWorkspace_groupsInput, Prisma.group_membersCreateNestedManyWithoutWorkspace_groupsInput> = z.object({
  create: z.union([z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => group_membersCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => group_membersWhereUniqueInputObjectSchema), z.lazy(() => group_membersWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const group_membersCreateNestedManyWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => group_membersCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => group_membersWhereUniqueInputObjectSchema), z.lazy(() => group_membersWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
