// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const ProjectsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProjectsNullableScalarRelationFilter, Prisma.ProjectsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => projectsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => projectsWhereInputObjectSchema).optional().nullable()
}).strict();
export const ProjectsNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => projectsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => projectsWhereInputObjectSchema).optional().nullable()
}).strict();
