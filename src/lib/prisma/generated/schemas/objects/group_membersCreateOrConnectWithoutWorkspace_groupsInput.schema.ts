// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersWhereUniqueInputObjectSchema } from './group_membersWhereUniqueInput.schema';
import { group_membersCreateWithoutWorkspace_groupsInputObjectSchema } from './group_membersCreateWithoutWorkspace_groupsInput.schema';
import { group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema } from './group_membersUncheckedCreateWithoutWorkspace_groupsInput.schema'

export const group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.group_membersCreateOrConnectWithoutWorkspace_groupsInput, Prisma.group_membersCreateOrConnectWithoutWorkspace_groupsInput> = z.object({
  where: z.lazy(() => group_membersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
export const group_membersCreateOrConnectWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  where: z.lazy(() => group_membersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
