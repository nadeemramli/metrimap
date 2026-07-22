// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsUpdateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUpdateWithoutTag_audiencesInput.schema';
import { workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUncheckedUpdateWithoutTag_audiencesInput.schema';
import { workspace_groupsCreateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsCreateWithoutTag_audiencesInput.schema';
import { workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutTag_audiencesInput.schema';
import { workspace_groupsWhereInputObjectSchema } from './workspace_groupsWhereInput.schema'

export const workspace_groupsUpsertWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpsertWithoutTag_audiencesInput, Prisma.workspace_groupsUpsertWithoutTag_audiencesInput> = z.object({
  update: z.union([z.lazy(() => workspace_groupsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)]),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]),
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional()
}).strict();
export const workspace_groupsUpsertWithoutTag_audiencesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => workspace_groupsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)]),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]),
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional()
}).strict();
