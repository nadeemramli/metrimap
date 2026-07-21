// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutProject_collaboratorsInputObjectSchema } from './projectsUpdateWithoutProject_collaboratorsInput.schema';
import { projectsUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema } from './projectsUncheckedUpdateWithoutProject_collaboratorsInput.schema'

export const projectsUpdateToOneWithWhereWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutProject_collaboratorsInput, Prisma.projectsUpdateToOneWithWhereWithoutProject_collaboratorsInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)])
}).strict();
