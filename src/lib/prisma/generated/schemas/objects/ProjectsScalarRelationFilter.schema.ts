// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const ProjectsScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProjectsScalarRelationFilter, Prisma.ProjectsScalarRelationFilter> = z.object({
  is: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const ProjectsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
