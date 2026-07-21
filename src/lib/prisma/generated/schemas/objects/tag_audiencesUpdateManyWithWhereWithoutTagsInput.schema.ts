// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesScalarWhereInputObjectSchema } from './tag_audiencesScalarWhereInput.schema';
import { tag_audiencesUpdateManyMutationInputObjectSchema } from './tag_audiencesUpdateManyMutationInput.schema';
import { tag_audiencesUncheckedUpdateManyWithoutTagsInputObjectSchema } from './tag_audiencesUncheckedUpdateManyWithoutTagsInput.schema'

export const tag_audiencesUpdateManyWithWhereWithoutTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUpdateManyWithWhereWithoutTagsInput, Prisma.tag_audiencesUpdateManyWithWhereWithoutTagsInput> = z.object({
  where: z.lazy(() => tag_audiencesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => tag_audiencesUpdateManyMutationInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateManyWithoutTagsInputObjectSchema)])
}).strict();
export const tag_audiencesUpdateManyWithWhereWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => tag_audiencesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => tag_audiencesUpdateManyMutationInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateManyWithoutTagsInputObjectSchema)])
}).strict();
