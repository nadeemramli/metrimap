// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsScalarWhereInputObjectSchema } from './metric_card_tagsScalarWhereInput.schema';
import { metric_card_tagsUpdateManyMutationInputObjectSchema } from './metric_card_tagsUpdateManyMutationInput.schema';
import { metric_card_tagsUncheckedUpdateManyWithoutTagsInputObjectSchema } from './metric_card_tagsUncheckedUpdateManyWithoutTagsInput.schema'

export const metric_card_tagsUpdateManyWithWhereWithoutTagsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpdateManyWithWhereWithoutTagsInput, Prisma.metric_card_tagsUpdateManyWithWhereWithoutTagsInput> = z.object({
  where: z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_card_tagsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedUpdateManyWithoutTagsInputObjectSchema)])
}).strict();
export const metric_card_tagsUpdateManyWithWhereWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_card_tagsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedUpdateManyWithoutTagsInputObjectSchema)])
}).strict();
