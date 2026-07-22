// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutAlert_rulesInputObjectSchema } from './projectsUpdateWithoutAlert_rulesInput.schema';
import { projectsUncheckedUpdateWithoutAlert_rulesInputObjectSchema } from './projectsUncheckedUpdateWithoutAlert_rulesInput.schema'

export const projectsUpdateToOneWithWhereWithoutAlert_rulesInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutAlert_rulesInput, Prisma.projectsUpdateToOneWithWhereWithoutAlert_rulesInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutAlert_rulesInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)])
}).strict();
