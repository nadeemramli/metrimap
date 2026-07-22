// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsWhereUniqueInputObjectSchema } from './workspace_groupsWhereUniqueInput.schema';
import { workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsCreateWithoutNode_access_grantsInput.schema';
import { workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutNode_access_grantsInput.schema'

export const workspace_groupsCreateOrConnectWithoutNode_access_grantsInputObjectSchema: z.ZodType<Prisma.workspace_groupsCreateOrConnectWithoutNode_access_grantsInput, Prisma.workspace_groupsCreateOrConnectWithoutNode_access_grantsInput> = z.object({
  where: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)])
}).strict();
export const workspace_groupsCreateOrConnectWithoutNode_access_grantsInputObjectZodSchema = z.object({
  where: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)])
}).strict();
