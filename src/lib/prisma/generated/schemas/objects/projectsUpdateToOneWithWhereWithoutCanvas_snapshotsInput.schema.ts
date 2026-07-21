// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutCanvas_snapshotsInputObjectSchema } from './projectsUpdateWithoutCanvas_snapshotsInput.schema';
import { projectsUncheckedUpdateWithoutCanvas_snapshotsInputObjectSchema } from './projectsUncheckedUpdateWithoutCanvas_snapshotsInput.schema'

export const projectsUpdateToOneWithWhereWithoutCanvas_snapshotsInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutCanvas_snapshotsInput, Prisma.projectsUpdateToOneWithWhereWithoutCanvas_snapshotsInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_snapshotsInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutCanvas_snapshotsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_snapshotsInputObjectSchema)])
}).strict();
