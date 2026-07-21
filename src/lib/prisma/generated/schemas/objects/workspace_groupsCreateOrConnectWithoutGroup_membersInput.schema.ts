// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsWhereUniqueInputObjectSchema } from './workspace_groupsWhereUniqueInput.schema';
import { workspace_groupsCreateWithoutGroup_membersInputObjectSchema } from './workspace_groupsCreateWithoutGroup_membersInput.schema';
import { workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutGroup_membersInput.schema'

export const workspace_groupsCreateOrConnectWithoutGroup_membersInputObjectSchema: z.ZodType<Prisma.workspace_groupsCreateOrConnectWithoutGroup_membersInput, Prisma.workspace_groupsCreateOrConnectWithoutGroup_membersInput> = z.object({
  where: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema)])
}).strict();
export const workspace_groupsCreateOrConnectWithoutGroup_membersInputObjectZodSchema = z.object({
  where: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema)])
}).strict();
