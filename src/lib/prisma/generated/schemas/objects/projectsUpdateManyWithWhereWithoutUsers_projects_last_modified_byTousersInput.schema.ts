// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsScalarWhereInputObjectSchema } from './projectsScalarWhereInput.schema';
import { projectsUpdateManyMutationInputObjectSchema } from './projectsUpdateManyMutationInput.schema';
import { projectsUncheckedUpdateManyWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUncheckedUpdateManyWithoutUsers_projects_last_modified_byTousersInput.schema'

export const projectsUpdateManyWithWhereWithoutUsers_projects_last_modified_byTousersInputObjectSchema: z.ZodType<Prisma.projectsUpdateManyWithWhereWithoutUsers_projects_last_modified_byTousersInput, Prisma.projectsUpdateManyWithWhereWithoutUsers_projects_last_modified_byTousersInput> = z.object({
  where: z.lazy(() => projectsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => projectsUpdateManyMutationInputObjectSchema), z.lazy(() => projectsUncheckedUpdateManyWithoutUsers_projects_last_modified_byTousersInputObjectSchema)])
}).strict();
export const projectsUpdateManyWithWhereWithoutUsers_projects_last_modified_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => projectsUpdateManyMutationInputObjectSchema), z.lazy(() => projectsUncheckedUpdateManyWithoutUsers_projects_last_modified_byTousersInputObjectSchema)])
}).strict();
