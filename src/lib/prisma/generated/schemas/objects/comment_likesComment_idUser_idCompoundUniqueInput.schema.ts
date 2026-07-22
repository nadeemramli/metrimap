// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_likesComment_idUser_idCompoundUniqueInputObjectSchema: z.ZodType<Prisma.comment_likesComment_idUser_idCompoundUniqueInput, Prisma.comment_likesComment_idUser_idCompoundUniqueInput> = z.object({
  comment_id: z.string(),
  user_id: z.string()
}).strict();
export const comment_likesComment_idUser_idCompoundUniqueInputObjectZodSchema = z.object({
  comment_id: z.string(),
  user_id: z.string()
}).strict();
