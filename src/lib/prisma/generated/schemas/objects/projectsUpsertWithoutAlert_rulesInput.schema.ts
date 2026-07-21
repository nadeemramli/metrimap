// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutAlert_rulesInputObjectSchema } from './projectsUpdateWithoutAlert_rulesInput.schema';
import { projectsUncheckedUpdateWithoutAlert_rulesInputObjectSchema } from './projectsUncheckedUpdateWithoutAlert_rulesInput.schema';
import { projectsCreateWithoutAlert_rulesInputObjectSchema } from './projectsCreateWithoutAlert_rulesInput.schema';
import { projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema } from './projectsUncheckedCreateWithoutAlert_rulesInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutAlert_rulesInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutAlert_rulesInput, Prisma.projectsUpsertWithoutAlert_rulesInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutAlert_rulesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
