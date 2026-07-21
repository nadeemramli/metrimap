// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsWhereInputObjectSchema } from './workspace_groupsWhereInput.schema';
import { workspace_groupsUpdateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUpdateWithoutNode_access_grantsInput.schema';
import { workspace_groupsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUncheckedUpdateWithoutNode_access_grantsInput.schema'

export const workspace_groupsUpdateToOneWithWhereWithoutNode_access_grantsInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpdateToOneWithWhereWithoutNode_access_grantsInput, Prisma.workspace_groupsUpdateToOneWithWhereWithoutNode_access_grantsInput> = z.object({
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => workspace_groupsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)])
}).strict();
export const workspace_groupsUpdateToOneWithWhereWithoutNode_access_grantsInputObjectZodSchema = z.object({
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => workspace_groupsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)])
}).strict();
