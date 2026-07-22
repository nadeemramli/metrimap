// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const group_membersGroup_idUser_idCompoundUniqueInputObjectSchema: z.ZodType<Prisma.group_membersGroup_idUser_idCompoundUniqueInput, Prisma.group_membersGroup_idUser_idCompoundUniqueInput> = z.object({
  group_id: z.string(),
  user_id: z.string()
}).strict();
export const group_membersGroup_idUser_idCompoundUniqueInputObjectZodSchema = z.object({
  group_id: z.string(),
  user_id: z.string()
}).strict();
