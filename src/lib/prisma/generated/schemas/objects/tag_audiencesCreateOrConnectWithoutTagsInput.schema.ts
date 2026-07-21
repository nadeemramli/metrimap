// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesWhereUniqueInputObjectSchema } from './tag_audiencesWhereUniqueInput.schema';
import { tag_audiencesCreateWithoutTagsInputObjectSchema } from './tag_audiencesCreateWithoutTagsInput.schema';
import { tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema } from './tag_audiencesUncheckedCreateWithoutTagsInput.schema'

export const tag_audiencesCreateOrConnectWithoutTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesCreateOrConnectWithoutTagsInput, Prisma.tag_audiencesCreateOrConnectWithoutTagsInput> = z.object({
  where: z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
export const tag_audiencesCreateOrConnectWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => tag_audiencesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tag_audiencesCreateWithoutTagsInputObjectSchema), z.lazy(() => tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
