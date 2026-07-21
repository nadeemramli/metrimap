// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_nodesWhereUniqueInputObjectSchema } from './canvas_nodesWhereUniqueInput.schema';
import { canvas_nodesUpdateWithoutProjectsInputObjectSchema } from './canvas_nodesUpdateWithoutProjectsInput.schema';
import { canvas_nodesUncheckedUpdateWithoutProjectsInputObjectSchema } from './canvas_nodesUncheckedUpdateWithoutProjectsInput.schema'

export const canvas_nodesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.canvas_nodesUpdateWithWhereUniqueWithoutProjectsInput, Prisma.canvas_nodesUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => canvas_nodesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const canvas_nodesUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => canvas_nodesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
