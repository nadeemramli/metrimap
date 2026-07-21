// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutMetric_cardsInputObjectSchema } from './projectsCreateWithoutMetric_cardsInput.schema';
import { projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './projectsUncheckedCreateWithoutMetric_cardsInput.schema';
import { projectsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './projectsCreateOrConnectWithoutMetric_cardsInput.schema';
import { projectsUpsertWithoutMetric_cardsInputObjectSchema } from './projectsUpsertWithoutMetric_cardsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutMetric_cardsInput.schema';
import { projectsUpdateWithoutMetric_cardsInputObjectSchema } from './projectsUpdateWithoutMetric_cardsInput.schema';
import { projectsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './projectsUncheckedUpdateWithoutMetric_cardsInput.schema'

export const projectsUpdateOneWithoutMetric_cardsNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneWithoutMetric_cardsNestedInput, Prisma.projectsUpdateOneWithoutMetric_cardsNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutMetric_cardsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneWithoutMetric_cardsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutMetric_cardsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]).optional()
}).strict();
