// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tag_audiencesCreateManyInputObjectSchema: z.ZodType<Prisma.tag_audiencesCreateManyInput, Prisma.tag_audiencesCreateManyInput> = z.object({
  tag_id: z.string(),
  group_id: z.string()
}).strict();
export const tag_audiencesCreateManyInputObjectZodSchema = z.object({
  tag_id: z.string(),
  group_id: z.string()
}).strict();
