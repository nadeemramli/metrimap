// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateWithoutUsers_projects_created_byTousersInputObjectSchema } from './projectsUpdateWithoutUsers_projects_created_byTousersInput.schema';
import { projectsUncheckedUpdateWithoutUsers_projects_created_byTousersInputObjectSchema } from './projectsUncheckedUpdateWithoutUsers_projects_created_byTousersInput.schema';
import { projectsCreateWithoutUsers_projects_created_byTousersInputObjectSchema } from './projectsCreateWithoutUsers_projects_created_byTousersInput.schema';
import { projectsUncheckedCreateWithoutUsers_projects_created_byTousersInputObjectSchema } from './projectsUncheckedCreateWithoutUsers_projects_created_byTousersInput.schema'

export const projectsUpsertWithWhereUniqueWithoutUsers_projects_created_byTousersInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithWhereUniqueWithoutUsers_projects_created_byTousersInput, Prisma.projectsUpsertWithWhereUniqueWithoutUsers_projects_created_byTousersInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => projectsUpdateWithoutUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutUsers_projects_created_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_created_byTousersInputObjectSchema)])
}).strict();
export const projectsUpsertWithWhereUniqueWithoutUsers_projects_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => projectsUpdateWithoutUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutUsers_projects_created_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_created_byTousersInputObjectSchema)])
}).strict();
