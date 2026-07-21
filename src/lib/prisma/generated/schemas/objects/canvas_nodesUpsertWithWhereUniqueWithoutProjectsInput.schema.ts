// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_nodesWhereUniqueInputObjectSchema } from './canvas_nodesWhereUniqueInput.schema';
import { canvas_nodesUpdateWithoutProjectsInputObjectSchema } from './canvas_nodesUpdateWithoutProjectsInput.schema';
import { canvas_nodesUncheckedUpdateWithoutProjectsInputObjectSchema } from './canvas_nodesUncheckedUpdateWithoutProjectsInput.schema';
import { canvas_nodesCreateWithoutProjectsInputObjectSchema } from './canvas_nodesCreateWithoutProjectsInput.schema';
import { canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema } from './canvas_nodesUncheckedCreateWithoutProjectsInput.schema'

export const canvas_nodesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.canvas_nodesUpsertWithWhereUniqueWithoutProjectsInput, Prisma.canvas_nodesUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => canvas_nodesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const canvas_nodesUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => canvas_nodesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
