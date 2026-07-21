// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tag_audiencesCreateManyWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.tag_audiencesCreateManyWorkspace_groupsInput, Prisma.tag_audiencesCreateManyWorkspace_groupsInput> = z.object({
  tag_id: z.string()
}).strict();
export const tag_audiencesCreateManyWorkspace_groupsInputObjectZodSchema = z.object({
  tag_id: z.string()
}).strict();
