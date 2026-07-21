// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersCreateWithoutProjects_projects_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutProjects_projects_created_byTousersInput.schema';
import { usersCreateOrConnectWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersCreateOrConnectWithoutProjects_projects_created_byTousersInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutProjects_projects_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutProjects_projects_created_byTousersInput, Prisma.usersCreateNestedOneWithoutProjects_projects_created_byTousersInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProjects_projects_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutProjects_projects_created_byTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProjects_projects_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
