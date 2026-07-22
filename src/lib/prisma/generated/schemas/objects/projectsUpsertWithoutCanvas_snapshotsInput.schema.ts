// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutCanvas_snapshotsInputObjectSchema } from './projectsUpdateWithoutCanvas_snapshotsInput.schema';
import { projectsUncheckedUpdateWithoutCanvas_snapshotsInputObjectSchema } from './projectsUncheckedUpdateWithoutCanvas_snapshotsInput.schema';
import { projectsCreateWithoutCanvas_snapshotsInputObjectSchema } from './projectsCreateWithoutCanvas_snapshotsInput.schema';
import { projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema } from './projectsUncheckedCreateWithoutCanvas_snapshotsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutCanvas_snapshotsInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutCanvas_snapshotsInput, Prisma.projectsUpsertWithoutCanvas_snapshotsInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_snapshotsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutCanvas_snapshotsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_snapshotsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
