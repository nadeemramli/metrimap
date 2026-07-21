// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersCreateWithoutProjects_projects_last_modified_byTousersInput.schema';
import { usersUncheckedCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutProjects_projects_last_modified_byTousersInput.schema';
import { usersCreateOrConnectWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersCreateOrConnectWithoutProjects_projects_last_modified_byTousersInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutProjects_projects_last_modified_byTousersInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutProjects_projects_last_modified_byTousersInput, Prisma.usersCreateNestedOneWithoutProjects_projects_last_modified_byTousersInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProjects_projects_last_modified_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutProjects_projects_last_modified_byTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProjects_projects_last_modified_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
