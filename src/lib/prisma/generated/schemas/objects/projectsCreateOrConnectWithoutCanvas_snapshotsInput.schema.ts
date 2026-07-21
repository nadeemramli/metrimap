// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutCanvas_snapshotsInputObjectSchema } from './projectsCreateWithoutCanvas_snapshotsInput.schema';
import { projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema } from './projectsUncheckedCreateWithoutCanvas_snapshotsInput.schema'

export const projectsCreateOrConnectWithoutCanvas_snapshotsInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutCanvas_snapshotsInput, Prisma.projectsCreateOrConnectWithoutCanvas_snapshotsInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutCanvas_snapshotsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema)])
}).strict();
