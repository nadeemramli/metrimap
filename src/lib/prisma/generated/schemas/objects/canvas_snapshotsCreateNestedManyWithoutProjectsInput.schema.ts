// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_snapshotsCreateWithoutProjectsInputObjectSchema } from './canvas_snapshotsCreateWithoutProjectsInput.schema';
import { canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema } from './canvas_snapshotsUncheckedCreateWithoutProjectsInput.schema';
import { canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema } from './canvas_snapshotsCreateOrConnectWithoutProjectsInput.schema';
import { canvas_snapshotsCreateManyProjectsInputEnvelopeObjectSchema } from './canvas_snapshotsCreateManyProjectsInputEnvelope.schema';
import { canvas_snapshotsWhereUniqueInputObjectSchema } from './canvas_snapshotsWhereUniqueInput.schema'

export const canvas_snapshotsCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsCreateNestedManyWithoutProjectsInput, Prisma.canvas_snapshotsCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => canvas_snapshotsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema), z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const canvas_snapshotsCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => canvas_snapshotsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema), z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
