// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateWithoutGroup_membersInputObjectSchema } from './workspace_groupsCreateWithoutGroup_membersInput.schema';
import { workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutGroup_membersInput.schema';
import { workspace_groupsCreateOrConnectWithoutGroup_membersInputObjectSchema } from './workspace_groupsCreateOrConnectWithoutGroup_membersInput.schema';
import { workspace_groupsUpsertWithoutGroup_membersInputObjectSchema } from './workspace_groupsUpsertWithoutGroup_membersInput.schema';
import { workspace_groupsWhereUniqueInputObjectSchema } from './workspace_groupsWhereUniqueInput.schema';
import { workspace_groupsUpdateToOneWithWhereWithoutGroup_membersInputObjectSchema } from './workspace_groupsUpdateToOneWithWhereWithoutGroup_membersInput.schema';
import { workspace_groupsUpdateWithoutGroup_membersInputObjectSchema } from './workspace_groupsUpdateWithoutGroup_membersInput.schema';
import { workspace_groupsUncheckedUpdateWithoutGroup_membersInputObjectSchema } from './workspace_groupsUncheckedUpdateWithoutGroup_membersInput.schema'

export const workspace_groupsUpdateOneRequiredWithoutGroup_membersNestedInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpdateOneRequiredWithoutGroup_membersNestedInput, Prisma.workspace_groupsUpdateOneRequiredWithoutGroup_membersNestedInput> = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutGroup_membersInputObjectSchema).optional(),
  upsert: z.lazy(() => workspace_groupsUpsertWithoutGroup_membersInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => workspace_groupsUpdateToOneWithWhereWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUpdateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutGroup_membersInputObjectSchema)]).optional()
}).strict();
export const workspace_groupsUpdateOneRequiredWithoutGroup_membersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutGroup_membersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutGroup_membersInputObjectSchema).optional(),
  upsert: z.lazy(() => workspace_groupsUpsertWithoutGroup_membersInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => workspace_groupsUpdateToOneWithWhereWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUpdateWithoutGroup_membersInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutGroup_membersInputObjectSchema)]).optional()
}).strict();
