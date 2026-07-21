// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutCanvas_nodesInputObjectSchema } from './projectsUpdateWithoutCanvas_nodesInput.schema';
import { projectsUncheckedUpdateWithoutCanvas_nodesInputObjectSchema } from './projectsUncheckedUpdateWithoutCanvas_nodesInput.schema'

export const projectsUpdateToOneWithWhereWithoutCanvas_nodesInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutCanvas_nodesInput, Prisma.projectsUpdateToOneWithWhereWithoutCanvas_nodesInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_nodesInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutCanvas_nodesInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_nodesInputObjectSchema)])
}).strict();
