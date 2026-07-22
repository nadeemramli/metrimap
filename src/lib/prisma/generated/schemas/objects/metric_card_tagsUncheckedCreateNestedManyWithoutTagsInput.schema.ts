// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsCreateWithoutTagsInputObjectSchema } from './metric_card_tagsCreateWithoutTagsInput.schema';
import { metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema } from './metric_card_tagsUncheckedCreateWithoutTagsInput.schema';
import { metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema } from './metric_card_tagsCreateOrConnectWithoutTagsInput.schema';
import { metric_card_tagsCreateManyTagsInputEnvelopeObjectSchema } from './metric_card_tagsCreateManyTagsInputEnvelope.schema';
import { metric_card_tagsWhereUniqueInputObjectSchema } from './metric_card_tagsWhereUniqueInput.schema'

export const metric_card_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUncheckedCreateNestedManyWithoutTagsInput, Prisma.metric_card_tagsUncheckedCreateNestedManyWithoutTagsInput> = z.object({
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_card_tagsCreateManyTagsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const metric_card_tagsUncheckedCreateNestedManyWithoutTagsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_card_tagsCreateManyTagsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
