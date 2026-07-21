// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_snapshotsScalarWhereInputObjectSchema } from './canvas_snapshotsScalarWhereInput.schema';
import { canvas_snapshotsUpdateManyMutationInputObjectSchema } from './canvas_snapshotsUpdateManyMutationInput.schema';
import { canvas_snapshotsUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './canvas_snapshotsUncheckedUpdateManyWithoutProjectsInput.schema'

export const canvas_snapshotsUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsUpdateManyWithWhereWithoutProjectsInput, Prisma.canvas_snapshotsUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => canvas_snapshotsUpdateManyMutationInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const canvas_snapshotsUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => canvas_snapshotsUpdateManyMutationInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
