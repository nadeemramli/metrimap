// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tag_audiencesTag_idGroup_idCompoundUniqueInputObjectSchema: z.ZodType<Prisma.tag_audiencesTag_idGroup_idCompoundUniqueInput, Prisma.tag_audiencesTag_idGroup_idCompoundUniqueInput> = z.object({
  tag_id: z.string(),
  group_id: z.string()
}).strict();
export const tag_audiencesTag_idGroup_idCompoundUniqueInputObjectZodSchema = z.object({
  tag_id: z.string(),
  group_id: z.string()
}).strict();
