// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesCreateWithoutWorkspace_groupsInput.schema';
import { tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUncheckedCreateWithoutWorkspace_groupsInput.schema';
import { tag_audiencesCreateOrConnectWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesCreateOrConnectWithoutWorkspace_groupsInput.schema';
import { tag_audiencesCreateManyWorkspace_groupsInputEnvelopeObjectSchema } from './tag_audiencesCreateManyWorkspace_groupsInputEnvelope.schema';
import { tag_audiencesWhereUniqueInputObjectSchema } from './tag_audiencesWhereUniqueInput.schema'

export const tag_audiencesUncheckedCreateNestedManyWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUncheckedCreateNestedManyWithoutWorkspace_groupsInput, Prisma.tag_audiencesUncheckedCreateNestedManyWithoutWorkspace_groupsInput> = z.object({
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tag_audiencesCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tag_audiencesCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const tag_audiencesUncheckedCreateNestedManyWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tag_audiencesCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tag_audiencesCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
