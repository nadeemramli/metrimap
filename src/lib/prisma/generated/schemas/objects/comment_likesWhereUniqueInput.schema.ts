// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesComment_idUser_idCompoundUniqueInputObjectSchema } from './comment_likesComment_idUser_idCompoundUniqueInput.schema'

export const comment_likesWhereUniqueInputObjectSchema: z.ZodType<Prisma.comment_likesWhereUniqueInput, Prisma.comment_likesWhereUniqueInput> = z.object({
  comment_id_user_id: z.lazy(() => comment_likesComment_idUser_idCompoundUniqueInputObjectSchema)
}).strict();
export const comment_likesWhereUniqueInputObjectZodSchema = z.object({
  comment_id_user_id: z.lazy(() => comment_likesComment_idUser_idCompoundUniqueInputObjectSchema)
}).strict();
