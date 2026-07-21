// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUpdateWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsUncheckedUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUncheckedUpdateWithoutUsers_projects_last_modified_byTousersInput.schema'

export const projectsUpdateWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema: z.ZodType<Prisma.projectsUpdateWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInput, Prisma.projectsUpdateWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => projectsUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema)])
}).strict();
export const projectsUpdateWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => projectsUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema)])
}).strict();
