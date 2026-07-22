// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tag_audiencesCreateManyTagsInputObjectSchema: z.ZodType<Prisma.tag_audiencesCreateManyTagsInput, Prisma.tag_audiencesCreateManyTagsInput> = z.object({
  group_id: z.string()
}).strict();
export const tag_audiencesCreateManyTagsInputObjectZodSchema = z.object({
  group_id: z.string()
}).strict();
