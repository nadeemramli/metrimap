// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const project_collaboratorsProject_idUser_idCompoundUniqueInputObjectSchema: z.ZodType<Prisma.project_collaboratorsProject_idUser_idCompoundUniqueInput, Prisma.project_collaboratorsProject_idUser_idCompoundUniqueInput> = z.object({
  project_id: z.string(),
  user_id: z.string()
}).strict();
export const project_collaboratorsProject_idUser_idCompoundUniqueInputObjectZodSchema = z.object({
  project_id: z.string(),
  user_id: z.string()
}).strict();
