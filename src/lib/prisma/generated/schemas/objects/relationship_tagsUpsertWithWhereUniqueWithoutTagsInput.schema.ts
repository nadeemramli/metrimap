// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsWhereUniqueInputObjectSchema } from './relationship_tagsWhereUniqueInput.schema';
import { relationship_tagsUpdateWithoutTagsInputObjectSchema } from './relationship_tagsUpdateWithoutTagsInput.schema';
import { relationship_tagsUncheckedUpdateWithoutTagsInputObjectSchema } from './relationship_tagsUncheckedUpdateWithoutTagsInput.schema';
import { relationship_tagsCreateWithoutTagsInputObjectSchema } from './relationship_tagsCreateWithoutTagsInput.schema';
import { relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema } from './relationship_tagsUncheckedCreateWithoutTagsInput.schema'

export const relationship_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpsertWithWhereUniqueWithoutTagsInput, Prisma.relationship_tagsUpsertWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationship_tagsUpdateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateWithoutTagsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
export const relationship_tagsUpsertWithWhereUniqueWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationship_tagsUpdateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateWithoutTagsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
