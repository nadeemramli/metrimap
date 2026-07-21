// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesCreateWithoutWorkspace_groupsInput.schema';
import { tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUncheckedCreateWithoutWorkspace_groupsInput.schema';
import { tag_audiencesCreateOrConnectWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesCreateOrConnectWithoutWorkspace_groupsInput.schema';
import { tag_audiencesUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUpsertWithWhereUniqueWithoutWorkspace_groupsInput.schema';
import { tag_audiencesCreateManyWorkspace_groupsInputEnvelopeObjectSchema } from './tag_audiencesCreateManyWorkspace_groupsInputEnvelope.schema';
import { tag_audiencesWhereUniqueInputObjectSchema } from './tag_audiencesWhereUniqueInput.schema';
import { tag_audiencesUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUpdateWithWhereUniqueWithoutWorkspace_groupsInput.schema';
import { tag_audiencesUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema } from './tag_audiencesUpdateManyWithWhereWithoutWorkspace_groupsInput.schema';
import { tag_audiencesScalarWhereInputObjectSchema } from './tag_audiencesScalarWhereInput.schema'

export const tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInputObjectSchema: z.ZodType<Prisma.tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInput, Prisma.tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInput> = z.object({
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tag_audiencesCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => tag_audiencesUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tag_audiencesCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => tag_audiencesUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => tag_audiencesUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => tag_audiencesScalarWhereInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const tag_audiencesUpdateManyWithoutWorkspace_groupsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesCreateWithoutWorkspace_groupsInputObjectSchema).array(), z.lazy(() => tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tag_audiencesCreateOrConnectWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesCreateOrConnectWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => tag_audiencesUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUpsertWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tag_audiencesCreateManyWorkspace_groupsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => tag_audiencesUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUpdateWithWhereUniqueWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => tag_audiencesUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema), z.lazy(() => tag_audiencesUpdateManyWithWhereWithoutWorkspace_groupsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => tag_audiencesScalarWhereInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
