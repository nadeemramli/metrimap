// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsWhereInputObjectSchema } from './project_collaboratorsWhereInput.schema'

export const Project_collaboratorsListRelationFilterObjectSchema: z.ZodType<Prisma.Project_collaboratorsListRelationFilter, Prisma.Project_collaboratorsListRelationFilter> = z.object({
  every: z.lazy(() => project_collaboratorsWhereInputObjectSchema).optional(),
  some: z.lazy(() => project_collaboratorsWhereInputObjectSchema).optional(),
  none: z.lazy(() => project_collaboratorsWhereInputObjectSchema).optional()
}).strict();
export const Project_collaboratorsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => project_collaboratorsWhereInputObjectSchema).optional(),
  some: z.lazy(() => project_collaboratorsWhereInputObjectSchema).optional(),
  none: z.lazy(() => project_collaboratorsWhereInputObjectSchema).optional()
}).strict();
