// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersCreateWithoutProjects_projects_last_modified_byTousersInput.schema';
import { usersUncheckedCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutProjects_projects_last_modified_byTousersInput.schema';
import { usersCreateOrConnectWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersCreateOrConnectWithoutProjects_projects_last_modified_byTousersInput.schema';
import { usersUpsertWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersUpsertWithoutProjects_projects_last_modified_byTousersInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersUpdateToOneWithWhereWithoutProjects_projects_last_modified_byTousersInput.schema';
import { usersUpdateWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersUpdateWithoutProjects_projects_last_modified_byTousersInput.schema';
import { usersUncheckedUpdateWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersUncheckedUpdateWithoutProjects_projects_last_modified_byTousersInput.schema'

export const usersUpdateOneWithoutProjects_projects_last_modified_byTousersNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneWithoutProjects_projects_last_modified_byTousersNestedInput, Prisma.usersUpdateOneWithoutProjects_projects_last_modified_byTousersNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProjects_projects_last_modified_byTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutProjects_projects_last_modified_byTousersInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutProjects_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutProjects_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProjects_projects_last_modified_byTousersInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneWithoutProjects_projects_last_modified_byTousersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProjects_projects_last_modified_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProjects_projects_last_modified_byTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutProjects_projects_last_modified_byTousersInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutProjects_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutProjects_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProjects_projects_last_modified_byTousersInputObjectSchema)]).optional()
}).strict();
