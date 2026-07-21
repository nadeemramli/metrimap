// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_nodesScalarWhereInputObjectSchema } from './canvas_nodesScalarWhereInput.schema';
import { canvas_nodesUpdateManyMutationInputObjectSchema } from './canvas_nodesUpdateManyMutationInput.schema';
import { canvas_nodesUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './canvas_nodesUncheckedUpdateManyWithoutProjectsInput.schema'

export const canvas_nodesUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.canvas_nodesUpdateManyWithWhereWithoutProjectsInput, Prisma.canvas_nodesUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => canvas_nodesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => canvas_nodesUpdateManyMutationInputObjectSchema), z.lazy(() => canvas_nodesUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const canvas_nodesUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => canvas_nodesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => canvas_nodesUpdateManyMutationInputObjectSchema), z.lazy(() => canvas_nodesUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
