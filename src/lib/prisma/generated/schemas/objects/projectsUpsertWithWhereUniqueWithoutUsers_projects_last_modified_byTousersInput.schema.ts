// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUpdateWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsUncheckedUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUncheckedUpdateWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsCreateWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInput.schema'

export const projectsUpsertWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInput, Prisma.projectsUpsertWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => projectsUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema)])
}).strict();
export const projectsUpsertWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => projectsUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutUsers_projects_last_modified_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema)])
}).strict();
