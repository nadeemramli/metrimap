// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_snapshotsWhereUniqueInputObjectSchema } from './canvas_snapshotsWhereUniqueInput.schema';
import { canvas_snapshotsUpdateWithoutProjectsInputObjectSchema } from './canvas_snapshotsUpdateWithoutProjectsInput.schema';
import { canvas_snapshotsUncheckedUpdateWithoutProjectsInputObjectSchema } from './canvas_snapshotsUncheckedUpdateWithoutProjectsInput.schema'

export const canvas_snapshotsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsUpdateWithWhereUniqueWithoutProjectsInput, Prisma.canvas_snapshotsUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => canvas_snapshotsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const canvas_snapshotsUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => canvas_snapshotsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
