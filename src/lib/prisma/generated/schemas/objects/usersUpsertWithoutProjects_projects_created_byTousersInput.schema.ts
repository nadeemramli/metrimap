// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersUpdateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUpdateWithoutProjects_projects_created_byTousersInput.schema';
import { usersUncheckedUpdateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUncheckedUpdateWithoutProjects_projects_created_byTousersInput.schema';
import { usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersCreateWithoutProjects_projects_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutProjects_projects_created_byTousersInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const usersUpsertWithoutProjects_projects_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersUpsertWithoutProjects_projects_created_byTousersInput, Prisma.usersUpsertWithoutProjects_projects_created_byTousersInput> = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProjects_projects_created_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const usersUpsertWithoutProjects_projects_created_byTousersInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProjects_projects_created_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
