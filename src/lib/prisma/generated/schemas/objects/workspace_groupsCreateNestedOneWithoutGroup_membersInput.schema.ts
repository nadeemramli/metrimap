// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateWithoutGroup_membersInputObjectSchema } from './workspace_groupsCreateWithoutGroup_membersInput.schema';
import { workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutGroup_membersInput.schema';
import { workspace_groupsCreateOrConnectWithoutGroup_membersInputObjectSchema } from './workspace_groupsCreateOrConnectWithoutGroup_membersInput.schema';
import { workspace_groupsWhereUniqueInputObjectSchema } from './workspace_groupsWhereUniqueInput.schema'

export const workspace_groupsCreateNestedOneWithoutGroup_membersInputObjectSchema: z.ZodType<Prisma.workspace_groupsCreateNestedOneWithoutGroup_membersInput, Prisma.workspace_groupsCreateNestedOneWithoutGroup_membersInput> = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutGroup_membersInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional()
}).strict();
export const workspace_groupsCreateNestedOneWithoutGroup_membersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutGroup_membersInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional()
}).strict();
