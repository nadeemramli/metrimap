// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutProject_collaboratorsInputObjectSchema } from './projectsUpdateWithoutProject_collaboratorsInput.schema';
import { projectsUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema } from './projectsUncheckedUpdateWithoutProject_collaboratorsInput.schema';
import { projectsCreateWithoutProject_collaboratorsInputObjectSchema } from './projectsCreateWithoutProject_collaboratorsInput.schema';
import { projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema } from './projectsUncheckedCreateWithoutProject_collaboratorsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutProject_collaboratorsInput, Prisma.projectsUpsertWithoutProject_collaboratorsInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
