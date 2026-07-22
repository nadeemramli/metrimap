// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_nodesCreateWithoutProjectsInputObjectSchema } from './canvas_nodesCreateWithoutProjectsInput.schema';
import { canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema } from './canvas_nodesUncheckedCreateWithoutProjectsInput.schema';
import { canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema } from './canvas_nodesCreateOrConnectWithoutProjectsInput.schema';
import { canvas_nodesCreateManyProjectsInputEnvelopeObjectSchema } from './canvas_nodesCreateManyProjectsInputEnvelope.schema';
import { canvas_nodesWhereUniqueInputObjectSchema } from './canvas_nodesWhereUniqueInput.schema'

export const canvas_nodesUncheckedCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.canvas_nodesUncheckedCreateNestedManyWithoutProjectsInput, Prisma.canvas_nodesUncheckedCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => canvas_nodesCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema), z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const canvas_nodesUncheckedCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => canvas_nodesCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema), z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
