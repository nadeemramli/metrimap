// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsCreateWithoutTagsInputObjectSchema } from './relationship_tagsCreateWithoutTagsInput.schema';
import { relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema } from './relationship_tagsUncheckedCreateWithoutTagsInput.schema';
import { relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema } from './relationship_tagsCreateOrConnectWithoutTagsInput.schema';
import { relationship_tagsCreateManyTagsInputEnvelopeObjectSchema } from './relationship_tagsCreateManyTagsInputEnvelope.schema';
import { relationship_tagsWhereUniqueInputObjectSchema } from './relationship_tagsWhereUniqueInput.schema'

export const relationship_tagsCreateNestedManyWithoutTagsInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateNestedManyWithoutTagsInput, Prisma.relationship_tagsCreateNestedManyWithoutTagsInput> = z.object({
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_tagsCreateManyTagsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const relationship_tagsCreateNestedManyWithoutTagsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema).array(), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsCreateOrConnectWithoutTagsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_tagsCreateManyTagsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
