// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsWhereUniqueInputObjectSchema } from './relationship_tagsWhereUniqueInput.schema';
import { relationship_tagsUpdateWithoutTagsInputObjectSchema } from './relationship_tagsUpdateWithoutTagsInput.schema';
import { relationship_tagsUncheckedUpdateWithoutTagsInputObjectSchema } from './relationship_tagsUncheckedUpdateWithoutTagsInput.schema'

export const relationship_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpdateWithWhereUniqueWithoutTagsInput, Prisma.relationship_tagsUpdateWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationship_tagsUpdateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateWithoutTagsInputObjectSchema)])
}).strict();
export const relationship_tagsUpdateWithWhereUniqueWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationship_tagsUpdateWithoutTagsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateWithoutTagsInputObjectSchema)])
}).strict();
