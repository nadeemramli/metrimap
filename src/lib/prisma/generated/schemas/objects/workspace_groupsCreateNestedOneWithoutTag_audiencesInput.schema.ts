// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsCreateWithoutTag_audiencesInput.schema';
import { workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema } from './workspace_groupsUncheckedCreateWithoutTag_audiencesInput.schema';
import { workspace_groupsCreateOrConnectWithoutTag_audiencesInputObjectSchema } from './workspace_groupsCreateOrConnectWithoutTag_audiencesInput.schema';
import { workspace_groupsWhereUniqueInputObjectSchema } from './workspace_groupsWhereUniqueInput.schema'

export const workspace_groupsCreateNestedOneWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.workspace_groupsCreateNestedOneWithoutTag_audiencesInput, Prisma.workspace_groupsCreateNestedOneWithoutTag_audiencesInput> = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutTag_audiencesInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional()
}).strict();
export const workspace_groupsCreateNestedOneWithoutTag_audiencesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => workspace_groupsCreateWithoutTag_audiencesInputObjectSchema), z.lazy(() => workspace_groupsUncheckedCreateWithoutTag_audiencesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => workspace_groupsCreateOrConnectWithoutTag_audiencesInputObjectSchema).optional(),
  connect: z.lazy(() => workspace_groupsWhereUniqueInputObjectSchema).optional()
}).strict();
