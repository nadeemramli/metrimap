// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyWhereUniqueInputObjectSchema } from './relationship_historyWhereUniqueInput.schema';
import { relationship_historyUpdateWithoutProjectsInputObjectSchema } from './relationship_historyUpdateWithoutProjectsInput.schema';
import { relationship_historyUncheckedUpdateWithoutProjectsInputObjectSchema } from './relationship_historyUncheckedUpdateWithoutProjectsInput.schema';
import { relationship_historyCreateWithoutProjectsInputObjectSchema } from './relationship_historyCreateWithoutProjectsInput.schema';
import { relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema } from './relationship_historyUncheckedCreateWithoutProjectsInput.schema'

export const relationship_historyUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationship_historyUpsertWithWhereUniqueWithoutProjectsInput, Prisma.relationship_historyUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationship_historyUpdateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const relationship_historyUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationship_historyUpdateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
