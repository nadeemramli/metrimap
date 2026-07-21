// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsUpdateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUpdateWithoutNode_access_grantsInput.schema';
import { workspace_groupsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUncheckedUpdateWithoutNode_access_grantsInput.schema';
import { workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsCreateWithoutNode_access_grantsInput.schema';
import { workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutNode_access_grantsInput.schema';
import { workspace_groupsWhereInputObjectSchema } from './workspace_groupsWhereInput.schema'

export const workspace_groupsUpsertWithoutNode_access_grantsInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpsertWithoutNode_access_grantsInput, Prisma.workspace_groupsUpsertWithoutNode_access_grantsInput> = z.object({
  update: z.union([z.lazy(() => workspace_groupsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)]),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]),
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional()
}).strict();
export const workspace_groupsUpsertWithoutNode_access_grantsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => workspace_groupsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)]),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]),
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional()
}).strict();
