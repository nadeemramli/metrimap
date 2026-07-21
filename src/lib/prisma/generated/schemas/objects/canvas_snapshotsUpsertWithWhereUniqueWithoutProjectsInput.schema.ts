// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_snapshotsWhereUniqueInputObjectSchema } from './canvas_snapshotsWhereUniqueInput.schema';
import { canvas_snapshotsUpdateWithoutProjectsInputObjectSchema } from './canvas_snapshotsUpdateWithoutProjectsInput.schema';
import { canvas_snapshotsUncheckedUpdateWithoutProjectsInputObjectSchema } from './canvas_snapshotsUncheckedUpdateWithoutProjectsInput.schema';
import { canvas_snapshotsCreateWithoutProjectsInputObjectSchema } from './canvas_snapshotsCreateWithoutProjectsInput.schema';
import { canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema } from './canvas_snapshotsUncheckedCreateWithoutProjectsInput.schema'

export const canvas_snapshotsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsUpsertWithWhereUniqueWithoutProjectsInput, Prisma.canvas_snapshotsUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => canvas_snapshotsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const canvas_snapshotsUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => canvas_snapshotsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
