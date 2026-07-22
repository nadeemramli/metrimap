// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsProject_idUser_idCompoundUniqueInputObjectSchema } from './project_collaboratorsProject_idUser_idCompoundUniqueInput.schema'

export const project_collaboratorsWhereUniqueInputObjectSchema: z.ZodType<Prisma.project_collaboratorsWhereUniqueInput, Prisma.project_collaboratorsWhereUniqueInput> = z.object({
  id: z.string(),
  project_id_user_id: z.lazy(() => project_collaboratorsProject_idUser_idCompoundUniqueInputObjectSchema)
}).strict();
export const project_collaboratorsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  project_id_user_id: z.lazy(() => project_collaboratorsProject_idUser_idCompoundUniqueInputObjectSchema)
}).strict();
