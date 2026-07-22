// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsWhereInputObjectSchema } from './workspace_groupsWhereInput.schema';
import { workspace_groupsUpdateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUpdateWithoutTag_audiencesInput.schema';
import { workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUncheckedUpdateWithoutTag_audiencesInput.schema'

export const workspace_groupsUpdateToOneWithWhereWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.workspace_groupsUpdateToOneWithWhereWithoutTag_audiencesInput, Prisma.workspace_groupsUpdateToOneWithWhereWithoutTag_audiencesInput> = z.object({
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => workspace_groupsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)])
}).strict();
export const workspace_groupsUpdateToOneWithWhereWithoutTag_audiencesInputObjectZodSchema = z.object({
  where: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => workspace_groupsUpdateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedUpdateWithoutTag_audiencesInputObjectSchema)])
}).strict();
