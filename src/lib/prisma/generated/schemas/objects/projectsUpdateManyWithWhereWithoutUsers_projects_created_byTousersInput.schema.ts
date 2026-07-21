// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsScalarWhereInputObjectSchema } from './projectsScalarWhereInput.schema';
import { projectsUpdateManyMutationInputObjectSchema } from './projectsUpdateManyMutationInput.schema';
import { projectsUncheckedUpdateManyWithoutUsers_projects_created_byTousersInputObjectSchema } from './projectsUncheckedUpdateManyWithoutUsers_projects_created_byTousersInput.schema'

export const projectsUpdateManyWithWhereWithoutUsers_projects_created_byTousersInputObjectSchema: z.ZodType<Prisma.projectsUpdateManyWithWhereWithoutUsers_projects_created_byTousersInput, Prisma.projectsUpdateManyWithWhereWithoutUsers_projects_created_byTousersInput> = z.object({
  where: z.lazy(() => projectsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => projectsUpdateManyMutationInputObjectSchema), z.lazy(() => projectsUncheckedUpdateManyWithoutUsers_projects_created_byTousersInputObjectSchema)])
}).strict();
export const projectsUpdateManyWithWhereWithoutUsers_projects_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => projectsUpdateManyMutationInputObjectSchema), z.lazy(() => projectsUncheckedUpdateManyWithoutUsers_projects_created_byTousersInputObjectSchema)])
}).strict();
