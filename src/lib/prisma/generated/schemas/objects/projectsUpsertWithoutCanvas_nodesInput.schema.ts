// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutCanvas_nodesInputObjectSchema } from './projectsUpdateWithoutCanvas_nodesInput.schema';
import { projectsUncheckedUpdateWithoutCanvas_nodesInputObjectSchema } from './projectsUncheckedUpdateWithoutCanvas_nodesInput.schema';
import { projectsCreateWithoutCanvas_nodesInputObjectSchema } from './projectsCreateWithoutCanvas_nodesInput.schema';
import { projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema } from './projectsUncheckedCreateWithoutCanvas_nodesInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutCanvas_nodesInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutCanvas_nodesInput, Prisma.projectsUpsertWithoutCanvas_nodesInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_nodesInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutCanvas_nodesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_nodesInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
