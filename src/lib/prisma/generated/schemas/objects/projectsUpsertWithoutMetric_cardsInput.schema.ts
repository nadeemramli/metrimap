// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutMetric_cardsInputObjectSchema } from './projectsUpdateWithoutMetric_cardsInput.schema';
import { projectsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './projectsUncheckedUpdateWithoutMetric_cardsInput.schema';
import { projectsCreateWithoutMetric_cardsInputObjectSchema } from './projectsCreateWithoutMetric_cardsInput.schema';
import { projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './projectsUncheckedCreateWithoutMetric_cardsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutMetric_cardsInput, Prisma.projectsUpsertWithoutMetric_cardsInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutMetric_cardsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
