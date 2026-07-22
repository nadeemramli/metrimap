// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsCreateWithoutNode_access_grantsInput.schema';
import { workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutNode_access_grantsInput.schema';
import { workspace_groupsCreateOrConnectWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsCreateOrConnectWithoutNode_access_grantsInput.schema';
import { workspace_groupsWhereUniqueInputObjectSchema } from './workspace_groupsWhereUniqueInput.schema'

export const workspace_groupsCreateNestedOneWithoutNode_access_grantsInputObjectSchema: z.ZodType<Prisma.workspace_groupsCreateNestedOneWithoutNode_access_grantsInput, Prisma.workspace_groupsCreateNestedOneWithoutNode_access_grantsInput> = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutNode_access_grantsInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional()
}).strict();
export const workspace_groupsCreateNestedOneWithoutNode_access_grantsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutNode_access_grantsInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional()
}).strict();
