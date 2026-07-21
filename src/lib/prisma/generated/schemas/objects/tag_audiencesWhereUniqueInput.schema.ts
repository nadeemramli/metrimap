// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesTag_idGroup_idCompoundUniqueInputObjectSchema } from './tag_audiencesTag_idGroup_idCompoundUniqueInput.schema'

export const tag_audiencesWhereUniqueInputObjectSchema: z.ZodType<Prisma.tag_audiencesWhereUniqueInput, Prisma.tag_audiencesWhereUniqueInput> = z.object({
  tag_id_group_id: z.lazy(() => tag_audiencesTag_idGroup_idCompoundUniqueInputObjectSchema)
}).strict();
export const tag_audiencesWhereUniqueInputObjectZodSchema = z.object({
  tag_id_group_id: z.lazy(() => tag_audiencesTag_idGroup_idCompoundUniqueInputObjectSchema)
}).strict();
