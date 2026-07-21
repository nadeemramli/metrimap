// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersUpdateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUpdateWithoutProjects_projects_created_byTousersInput.schema';
import { usersUncheckedUpdateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUncheckedUpdateWithoutProjects_projects_created_byTousersInput.schema'

export const usersUpdateToOneWithWhereWithoutProjects_projects_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersUpdateToOneWithWhereWithoutProjects_projects_created_byTousersInput, Prisma.usersUpdateToOneWithWhereWithoutProjects_projects_created_byTousersInput> = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProjects_projects_created_byTousersInputObjectSchema)])
}).strict();
export const usersUpdateToOneWithWhereWithoutProjects_projects_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProjects_projects_created_byTousersInputObjectSchema)])
}).strict();
