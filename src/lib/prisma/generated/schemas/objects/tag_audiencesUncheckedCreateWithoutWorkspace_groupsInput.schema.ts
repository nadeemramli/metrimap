// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.tag_audiencesUncheckedCreateWithoutWorkspace_groupsInput, Prisma.tag_audiencesUncheckedCreateWithoutWorkspace_groupsInput> = z.object({
  tag_id: z.string()
}).strict();
export const tag_audiencesUncheckedCreateWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  tag_id: z.string()
}).strict();
