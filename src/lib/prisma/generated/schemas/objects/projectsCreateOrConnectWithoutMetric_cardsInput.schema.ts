// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutMetric_cardsInputObjectSchema } from './projectsCreateWithoutMetric_cardsInput.schema';
import { projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './projectsUncheckedCreateWithoutMetric_cardsInput.schema'

export const projectsCreateOrConnectWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutMetric_cardsInput, Prisma.projectsCreateOrConnectWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
