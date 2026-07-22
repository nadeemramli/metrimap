// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersWhereUniqueInputObjectSchema } from './group_membersWhereUniqueInput.schema';
import { group_membersUpdateWithoutWorkspace_groupsInputObjectSchema } from './group_membersUpdateWithoutWorkspace_groupsInput.schema';
import { group_membersUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema } from './group_membersUncheckedUpdateWithoutWorkspace_groupsInput.schema'

export const group_membersUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.group_membersUpdateWithWhereUniqueWithoutWorkspace_groupsInput, Prisma.group_membersUpdateWithWhereUniqueWithoutWorkspace_groupsInput> = z.object({
  where: z.lazy(() => group_membersWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => group_membersUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
export const group_membersUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  where: z.lazy(() => group_membersWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => group_membersUpdateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => group_membersUncheckedUpdateWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
