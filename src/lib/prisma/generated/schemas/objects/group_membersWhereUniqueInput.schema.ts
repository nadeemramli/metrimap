// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersGroup_idUser_idCompoundUniqueInputObjectSchema } from './group_membersGroup_idUser_idCompoundUniqueInput.schema'

export const group_membersWhereUniqueInputObjectSchema: z.ZodType<Prisma.group_membersWhereUniqueInput, Prisma.group_membersWhereUniqueInput> = z.object({
  group_id_user_id: z.lazy(() => group_membersGroup_idUser_idCompoundUniqueInputObjectSchema)
}).strict();
export const group_membersWhereUniqueInputObjectZodSchema = z.object({
  group_id_user_id: z.lazy(() => group_membersGroup_idUser_idCompoundUniqueInputObjectSchema)
}).strict();
