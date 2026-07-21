// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsCreateWithoutTagsInputObjectSchema } from './metric_card_tagsCreateWithoutTagsInput.schema';
import { metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema } from './metric_card_tagsUncheckedCreateWithoutTagsInput.schema';
import { metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema } from './metric_card_tagsCreateOrConnectWithoutTagsInput.schema';
import { metric_card_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema } from './metric_card_tagsUpsertWithWhereUniqueWithoutTagsInput.schema';
import { metric_card_tagsCreateManyTagsInputEnvelopeObjectSchema } from './metric_card_tagsCreateManyTagsInputEnvelope.schema';
import { metric_card_tagsWhereUniqueInputObjectSchema } from './metric_card_tagsWhereUniqueInput.schema';
import { metric_card_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema } from './metric_card_tagsUpdateWithWhereUniqueWithoutTagsInput.schema';
import { metric_card_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema } from './metric_card_tagsUpdateManyWithWhereWithoutTagsInput.schema';
import { metric_card_tagsScalarWhereInputObjectSchema } from './metric_card_tagsScalarWhereInput.schema'

export const metric_card_tagsUpdateManyWithoutTagsNestedInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpdateManyWithoutTagsNestedInput, Prisma.metric_card_tagsUpdateManyWithoutTagsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_card_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_card_tagsCreateManyTagsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_card_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_card_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const metric_card_tagsUpdateManyWithoutTagsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_card_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_card_tagsCreateManyTagsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_card_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_card_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
