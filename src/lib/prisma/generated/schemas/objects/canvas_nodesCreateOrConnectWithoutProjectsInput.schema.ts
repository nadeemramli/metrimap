// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_nodesWhereUniqueInputObjectSchema } from './canvas_nodesWhereUniqueInput.schema';
import { canvas_nodesCreateWithoutProjectsInputObjectSchema } from './canvas_nodesCreateWithoutProjectsInput.schema';
import { canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema } from './canvas_nodesUncheckedCreateWithoutProjectsInput.schema'

export const canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.canvas_nodesCreateOrConnectWithoutProjectsInput, Prisma.canvas_nodesCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const canvas_nodesCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
