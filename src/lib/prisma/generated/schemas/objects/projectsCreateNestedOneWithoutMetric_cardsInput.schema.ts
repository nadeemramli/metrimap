// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutMetric_cardsInputObjectSchema } from './projectsCreateWithoutMetric_cardsInput.schema';
import { projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './projectsUncheckedCreateWithoutMetric_cardsInput.schema';
import { projectsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './projectsCreateOrConnectWithoutMetric_cardsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutMetric_cardsInput, Prisma.projectsCreateNestedOneWithoutMetric_cardsInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutMetric_cardsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
