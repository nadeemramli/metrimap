// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsWhereInputObjectSchema } from './workspace_groupsWhereInput.schema';
import { workspace_groupsUpdateWithoutGroup_membersInputObjectSchema } from './workspace_groupsUpdateWithoutGroup_membersInput.schema';
import { workspace_groupsUncheckedUpdateWithoutGroup_membersInputObjectSchema } from './workspace_groupsUncheckedUpdateWithoutGroup_membersInput.schema'

export const workspace_groupsUpdateToOneWithWhereWithoutGroup_membersInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpdateToOneWithWhereWithoutGroup_membersInput, Prisma.workspace_groupsUpdateToOneWithWhereWithoutGroup_membersInput> = z.object({
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => workspace_groupsUpdateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutGroup_membersInputObjectSchema)])
}).strict();
export const workspace_groupsUpdateToOneWithWhereWithoutGroup_membersInputObjectZodSchema = z.object({
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => workspace_groupsUpdateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutGroup_membersInputObjectSchema)])
}).strict();
