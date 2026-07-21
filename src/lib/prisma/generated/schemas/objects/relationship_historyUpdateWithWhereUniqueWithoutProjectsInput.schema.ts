// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyWhereUniqueInputObjectSchema } from './relationship_historyWhereUniqueInput.schema';
import { relationship_historyUpdateWithoutProjectsInputObjectSchema } from './relationship_historyUpdateWithoutProjectsInput.schema';
import { relationship_historyUncheckedUpdateWithoutProjectsInputObjectSchema } from './relationship_historyUncheckedUpdateWithoutProjectsInput.schema'

export const relationship_historyUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationship_historyUpdateWithWhereUniqueWithoutProjectsInput, Prisma.relationship_historyUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationship_historyUpdateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const relationship_historyUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationship_historyUpdateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
