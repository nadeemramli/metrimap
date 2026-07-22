// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersScalarWhereInputObjectSchema } from './group_membersScalarWhereInput.schema';
import { group_membersUpdateManyMutationInputObjectSchema } from './group_membersUpdateManyMutationInput.schema';
import { group_membersUncheckedUpdateManyWithoutWorkspace_groupsInputObjectSchema } from './group_membersUncheckedUpdateManyWithoutWorkspace_groupsInput.schema'

export const group_membersUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.group_membersUpdateManyWithWhereWithoutWorkspace_groupsInput, Prisma.group_membersUpdateManyWithWhereWithoutWorkspace_groupsInput> = z.object({
  where: z.lazy(() => group_membersScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => group_membersUpdateManyMutationInputObjectSchema), z.lazy(() => group_membersUncheckedUpdateManyWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
export const group_membersUpdateManyWithWhereWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  where: z.lazy(() => group_membersScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => group_membersUpdateManyMutationInputObjectSchema), z.lazy(() => group_membersUncheckedUpdateManyWithoutWorkspace_groupsInputObjectSchema)])
}).strict();
