// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutMetric_cardsInputObjectSchema } from './projectsUpdateWithoutMetric_cardsInput.schema';
import { projectsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './projectsUncheckedUpdateWithoutMetric_cardsInput.schema'

export const projectsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutMetric_cardsInput, Prisma.projectsUpdateToOneWithWhereWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
