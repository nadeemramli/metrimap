// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_snapshotsWhereUniqueInputObjectSchema } from './canvas_snapshotsWhereUniqueInput.schema';
import { canvas_snapshotsCreateWithoutProjectsInputObjectSchema } from './canvas_snapshotsCreateWithoutProjectsInput.schema';
import { canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema } from './canvas_snapshotsUncheckedCreateWithoutProjectsInput.schema'

export const canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsCreateOrConnectWithoutProjectsInput, Prisma.canvas_snapshotsCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
