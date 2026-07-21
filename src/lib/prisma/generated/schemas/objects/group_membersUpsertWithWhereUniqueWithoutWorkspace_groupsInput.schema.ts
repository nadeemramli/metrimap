// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersWhereUniqueInputObjectSchema } from './group_membersWhereUniqueInput.schema';
import { group_membersUpdateWithoutWorkspace_groupsInputObjectSchema } from './group_membersUpdateWithoutWorkspace_groupsInput.schema';
import { group_membersUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema } from './group_membersUncheckedUpdateWithoutWorkspace_groupsInput.schema';
import { group_membersCreateWithoutWorkspace_groupsInputObjectSchema } from './group_membersCreateWithoutWorkspace_groupsInput.schema';
import { group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema } from './group_membersUncheckedCreateWithoutWorkspace_groupsInput.schema'

export const group_membersUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.group_membersUpsertWithWhereUniqueWithoutWorkspace_groupsInput, Prisma.group_membersUpsertWithWhereUniqueWithoutWorkspace_groupsInput> = z.object({
  where: z.lazy(() => group_membersWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => group_membersUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)]),
  create: z.union([z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
export const group_membersUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  where: z.lazy(() => group_membersWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => group_membersUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)]),
  create: z.union([z.lazy(() => group_membersCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
