// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsCreateWithoutTag_audiencesInput.schema';
import { workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutTag_audiencesInput.schema';
import { workspace_groupsCreateOrConnectWithoutTag_audiencesInputObjectSchema } from './workspace_groupsCreateOrConnectWithoutTag_audiencesInput.schema';
import { workspace_groupsUpsertWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUpsertWithoutTag_audiencesInput.schema';
import { workspace_groupsWhereUniqueInputObjectSchema } from './workspace_groupsWhereUniqueInput.schema';
import { workspace_groupsUpdateToOneWithWhereWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUpdateToOneWithWhereWithoutTag_audiencesInput.schema';
import { workspace_groupsUpdateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUpdateWithoutTag_audiencesInput.schema';
import { workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUncheckedUpdateWithoutTag_audiencesInput.schema'

export const workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInput, Prisma.workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInput> = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutTag_audiencesInputObjectSchema).optional(),
  upsert: z.lazy(() => workspace_groupsUpsertWithoutTag_audiencesInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => workspace_groupsUpdateToOneWithWhereWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)]).optional()
}).strict();
export const workspace_groupsUpdateOneRequiredWithoutTag_audiencesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutTag_audiencesInputObjectSchema).optional(),
  upsert: z.lazy(() => workspace_groupsUpsertWithoutTag_audiencesInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => workspace_groupsUpdateToOneWithWhereWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)]).optional()
}).strict();
