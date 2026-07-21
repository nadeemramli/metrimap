// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesWhereUniqueInputObjectSchema } from './tag_audiencesWhereUniqueInput.schema';
import { tag_audiencesUpdateWithoutTagsInputObjectSchema } from './tag_audiencesUpdateWithoutTagsInput.schema';
import { tag_audiencesUncheckedUpdateWithoutTagsInputObjectSchema } from './tag_audiencesUncheckedUpdateWithoutTagsInput.schema'

export const tag_audiencesUpdateWithWhereUniqueWithoutTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUpdateWithWhereUniqueWithoutTagsInput, Prisma.tag_audiencesUpdateWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => tag_audiencesUpdateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateWithoutTagsInputObjectSchema)])
}).strict();
export const tag_audiencesUpdateWithWhereUniqueWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => tag_audiencesUpdateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateWithoutTagsInputObjectSchema)])
}).strict();
