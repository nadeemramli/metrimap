// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersCreateWithoutProjects_projects_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutProjects_projects_created_byTousersInput.schema';
import { usersCreateOrConnectWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersCreateOrConnectWithoutProjects_projects_created_byTousersInput.schema';
import { usersUpsertWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUpsertWithoutProjects_projects_created_byTousersInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUpdateToOneWithWhereWithoutProjects_projects_created_byTousersInput.schema';
import { usersUpdateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUpdateWithoutProjects_projects_created_byTousersInput.schema';
import { usersUncheckedUpdateWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersUncheckedUpdateWithoutProjects_projects_created_byTousersInput.schema'

export const usersUpdateOneRequiredWithoutProjects_projects_created_byTousersNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneRequiredWithoutProjects_projects_created_byTousersNestedInput, Prisma.usersUpdateOneRequiredWithoutProjects_projects_created_byTousersNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProjects_projects_created_byTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutProjects_projects_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProjects_projects_created_byTousersInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneRequiredWithoutProjects_projects_created_byTousersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProjects_projects_created_byTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutProjects_projects_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutProjects_projects_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProjects_projects_created_byTousersInputObjectSchema)]).optional()
}).strict();
