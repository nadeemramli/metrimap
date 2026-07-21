// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsScalarWhereInputObjectSchema } from './relationship_tagsScalarWhereInput.schema';
import { relationship_tagsUpdateManyMutationInputObjectSchema } from './relationship_tagsUpdateManyMutationInput.schema';
import { relationship_tagsUncheckedUpdateManyWithoutTagsInputObjectSchema } from './relationship_tagsUncheckedUpdateManyWithoutTagsInput.schema'

export const relationship_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpdateManyWithWhereWithoutTagsInput, Prisma.relationship_tagsUpdateManyWithWhereWithoutTagsInput> = z.object({
  where: z.lazy(() => relationship_tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationship_tagsUpdateManyMutationInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateManyWithoutTagsInputObjectSchema)])
}).strict();
export const relationship_tagsUpdateManyWithWhereWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationship_tagsUpdateManyMutationInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateManyWithoutTagsInputObjectSchema)])
}).strict();
