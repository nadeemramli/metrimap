// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsCreateWithoutTagsInputObjectSchema } from './relationship_tagsCreateWithoutTagsInput.schema';
import { relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema } from './relationship_tagsUncheckedCreateWithoutTagsInput.schema';
import { relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema } from './relationship_tagsCreateOrConnectWithoutTagsInput.schema';
import { relationship_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema } from './relationship_tagsUpsertWithWhereUniqueWithoutTagsInput.schema';
import { relationship_tagsCreateManyTagsInputEnvelopeObjectSchema } from './relationship_tagsCreateManyTagsInputEnvelope.schema';
import { relationship_tagsWhereUniqueInputObjectSchema } from './relationship_tagsWhereUniqueInput.schema';
import { relationship_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema } from './relationship_tagsUpdateWithWhereUniqueWithoutTagsInput.schema';
import { relationship_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema } from './relationship_tagsUpdateManyWithWhereWithoutTagsInput.schema';
import { relationship_tagsScalarWhereInputObjectSchema } from './relationship_tagsScalarWhereInput.schema'

export const relationship_tagsUpdateManyWithoutTagsNestedInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpdateManyWithoutTagsNestedInput, Prisma.relationship_tagsUpdateManyWithoutTagsNestedInput> = z.object({
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationship_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_tagsCreateManyTagsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationship_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationship_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationship_tagsScalarWhereInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const relationship_tagsUpdateManyWithoutTagsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationship_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_tagsCreateManyTagsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationship_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationship_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationship_tagsScalarWhereInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
