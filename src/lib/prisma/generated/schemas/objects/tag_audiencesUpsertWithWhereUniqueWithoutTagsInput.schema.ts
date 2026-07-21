// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesWhereUniqueInputObjectSchema } from './tag_audiencesWhereUniqueInput.schema';
import { tag_audiencesUpdateWithoutTagsInputObjectSchema } from './tag_audiencesUpdateWithoutTagsInput.schema';
import { tag_audiencesUncheckedUpdateWithoutTagsInputObjectSchema } from './tag_audiencesUncheckedUpdateWithoutTagsInput.schema';
import { tag_audiencesCreateWithoutTagsInputObjectSchema } from './tag_audiencesCreateWithoutTagsInput.schema';
import { tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema } from './tag_audiencesUncheckedCreateWithoutTagsInput.schema'

export const tag_audiencesUpsertWithWhereUniqueWithoutTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUpsertWithWhereUniqueWithoutTagsInput, Prisma.tag_audiencesUpsertWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => tag_audiencesUpdateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateWithoutTagsInputObjectSchema)]),
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
export const tag_audiencesUpsertWithWhereUniqueWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => tag_audiencesUpdateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedUpdateWithoutTagsInputObjectSchema)]),
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
