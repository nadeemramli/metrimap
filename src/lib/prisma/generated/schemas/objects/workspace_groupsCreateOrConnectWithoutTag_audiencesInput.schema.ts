// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsWhereUniqueInputObjectSchema } from './workspace_groupsWhereUniqueInput.schema';
import { workspace_groupsCreateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsCreateWithoutTag_audiencesInput.schema';
import { workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutTag_audiencesInput.schema'

export const workspace_groupsCreateOrConnectWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.workspace_groupsCreateOrConnectWithoutTag_audiencesInput, Prisma.workspace_groupsCreateOrConnectWithoutTag_audiencesInput> = z.object({
  where: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema)])
}).strict();
export const workspace_groupsCreateOrConnectWithoutTag_audiencesInputObjectZodSchema = z.object({
  where: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema)])
}).strict();
