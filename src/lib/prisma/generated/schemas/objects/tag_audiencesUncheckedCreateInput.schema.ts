// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tag_audiencesUncheckedCreateInputObjectSchema: z.ZodType<Prisma.tag_audiencesUncheckedCreateInput, Prisma.tag_audiencesUncheckedCreateInput> = z.object({
  tag_id: z.string(),
  group_id: z.string()
}).strict();
export const tag_audiencesUncheckedCreateInputObjectZodSchema = z.object({
  tag_id: z.string(),
  group_id: z.string()
}).strict();
