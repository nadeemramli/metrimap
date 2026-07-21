// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsCreateWithoutWorkspace_groupsInput.schema';
import { node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsUncheckedCreateWithoutWorkspace_groupsInput.schema';
import { node_access_grantsCreateOrConnectWithoutWorkspace_groupsInputObjectSchema } from './node_access_grantsCreateOrConnectWithoutWorkspace_groupsInput.schema';
import { node_access_grantsCreateManyWorkspace_groupsInputEnvelopeObjectSchema } from './node_access_grantsCreateManyWorkspace_groupsInputEnvelope.schema';
import { node_access_grantsWhereUniqueInputObjectSchema } from './node_access_grantsWhereUniqueInput.schema'

export const node_access_grantsUncheckedCreateNestedManyWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUncheckedCreateNestedManyWithoutWorkspace_groupsInput, Prisma.node_access_grantsUncheckedCreateNestedManyWithoutWorkspace_groupsInput> = z.object({
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => node_access_grantsCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => node_access_grantsCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const node_access_grantsUncheckedCreateNestedManyWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => node_access_grantsCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => node_access_grantsCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => node_access_grantsCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
