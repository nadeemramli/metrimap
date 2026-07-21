// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsUpdateWithoutGroup_membersInputObjectSchema } from './workspace_groupsUpdateWithoutGroup_membersInput.schema';
import { workspace_groupsUncheckedUpdateWithoutGroup_membersInputObjectSchema } from './workspace_groupsUncheckedUpdateWithoutGroup_membersInput.schema';
import { workspace_groupsCreateWithoutGroup_membersInputObjectSchema } from './workspace_groupsCreateWithoutGroup_membersInput.schema';
import { workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutGroup_membersInput.schema';
import { workspace_groupsWhereInputObjectSchema } from './workspace_groupsWhereInput.schema'

export const workspace_groupsUpsertWithoutGroup_membersInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpsertWithoutGroup_membersInput, Prisma.workspace_groupsUpsertWithoutGroup_membersInput> = z.object({
  update: z.union([z.lazy(() => workspace_groupsUpdateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutGroup_membersInputObjectSchema)]),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema)]),
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional()
}).strict();
export const workspace_groupsUpsertWithoutGroup_membersInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => workspace_groupsUpdateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutGroup_membersInputObjectSchema)]),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema)]),
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional()
}).strict();
