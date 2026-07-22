// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsCreateWithoutNode_access_grantsInput.schema';
import { workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutNode_access_grantsInput.schema';
import { workspace_groupsCreateOrConnectWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsCreateOrConnectWithoutNode_access_grantsInput.schema';
import { workspace_groupsUpsertWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUpsertWithoutNode_access_grantsInput.schema';
import { workspace_groupsWhereUniqueInputObjectSchema } from './workspace_groupsWhereUniqueInput.schema';
import { workspace_groupsUpdateToOneWithWhereWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUpdateToOneWithWhereWithoutNode_access_grantsInput.schema';
import { workspace_groupsUpdateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUpdateWithoutNode_access_grantsInput.schema';
import { workspace_groupsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema } from './workspace_groupsUncheckedUpdateWithoutNode_access_grantsInput.schema'

export const workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInput, Prisma.workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInput> = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutNode_access_grantsInputObjectSchema).optional(),
  upsert: z.lazy(() => workspace_groupsUpsertWithoutNode_access_grantsInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => workspace_groupsUpdateToOneWithWhereWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)]).optional()
}).strict();
export const workspace_groupsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutNode_access_grantsInputObjectSchema).optional(),
  upsert: z.lazy(() => workspace_groupsUpsertWithoutNode_access_grantsInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => workspace_groupsUpdateToOneWithWhereWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)]).optional()
}).strict();
