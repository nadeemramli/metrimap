// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersCreateWithoutProjects_projects_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutProjects_projects_created_byTousersInput.schema'

export const usersCreateOrConnectWithoutProjects_projects_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersCreateOrConnectWithoutProjects_projects_created_byTousersInput, Prisma.usersCreateOrConnectWithoutProjects_projects_created_byTousersInput> = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema)])
}).strict();
export const usersCreateOrConnectWithoutProjects_projects_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema)])
}).strict();
