// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tag_audiencesUncheckedCreateWithoutTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUncheckedCreateWithoutTagsInput, Prisma.tag_audiencesUncheckedCreateWithoutTagsInput> = z.object({
  group_id: z.string()
}).strict();
export const tag_audiencesUncheckedCreateWithoutTagsInputObjectZodSchema = z.object({
  group_id: z.string()
}).strict();
