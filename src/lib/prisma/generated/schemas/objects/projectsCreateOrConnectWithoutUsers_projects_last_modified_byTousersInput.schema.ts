// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsCreateWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInput.schema'

export const projectsCreateOrConnectWithoutUsers_projects_last_modified_byTousersInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutUsers_projects_last_modified_byTousersInput, Prisma.projectsCreateOrConnectWithoutUsers_projects_last_modified_byTousersInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutUsers_projects_last_modified_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema)])
}).strict();
