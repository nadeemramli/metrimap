// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const ProjectsListRelationFilterObjectSchema: z.ZodType<Prisma.ProjectsListRelationFilter, Prisma.ProjectsListRelationFilter> = z.object({
  every: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  some: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  none: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const ProjectsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  some: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  none: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
