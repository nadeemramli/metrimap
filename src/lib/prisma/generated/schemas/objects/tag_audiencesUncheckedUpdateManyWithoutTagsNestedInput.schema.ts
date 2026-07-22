// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesCreateWithoutTagsInputObjectSchema } from './tag_audiencesCreateWithoutTagsInput.schema';
import { tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema } from './tag_audiencesUncheckedCreateWithoutTagsInput.schema';
import { tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema } from './tag_audiencesCreateOrConnectWithoutTagsInput.schema';
import { tag_audiencesUpsertWithWhereUniqueWithoutTagsInputObjectSchema } from './tag_audiencesUpsertWithWhereUniqueWithoutTagsInput.schema';
import { tag_audiencesCreateManyTagsInputEnvelopeObjectSchema } from './tag_audiencesCreateManyTagsInputEnvelope.schema';
import { tag_audiencesWhereUniqueInputObjectSchema } from './tag_audiencesWhereUniqueInput.schema';
import { tag_audiencesUpdateWithWhereUniqueWithoutTagsInputObjectSchema } from './tag_audiencesUpdateWithWhereUniqueWithoutTagsInput.schema';
import { tag_audiencesUpdateManyWithWhereWithoutTagsInputObjectSchema } from './tag_audiencesUpdateManyWithWhereWithoutTagsInput.schema';
import { tag_audiencesScalarWhereInputObjectSchema } from './tag_audiencesScalarWhereInput.schema'

export const tag_audiencesUncheckedUpdateManyWithoutTagsNestedInputObjectSchema: z.ZodType<Prisma.tag_audiencesUncheckedUpdateManyWithoutTagsNestedInput, Prisma.tag_audiencesUncheckedUpdateManyWithoutTagsNestedInput> = z.object({
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => tag_audiencesUpsertWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUpsertWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tag_audiencesCreateManyTagsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => tag_audiencesUpdateWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUpdateWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => tag_audiencesUpdateManyWithWhereWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUpdateManyWithWhereWithoutTagsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => tag_audiencesScalarWhereInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const tag_audiencesUncheckedUpdateManyWithoutTagsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => tag_audiencesUpsertWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUpsertWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tag_audiencesCreateManyTagsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema), z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => tag_audiencesUpdateWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUpdateWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => tag_audiencesUpdateManyWithWhereWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUpdateManyWithWhereWithoutTagsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => tag_audiencesScalarWhereInputObjectSchema), z.lazy(() => tag_audiencesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
