// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutCanvas_snapshotsInputObjectSchema } from './projectsCreateWithoutCanvas_snapshotsInput.schema';
import { projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema } from './projectsUncheckedCreateWithoutCanvas_snapshotsInput.schema';
import { projectsCreateOrConnectWithoutCanvas_snapshotsInputObjectSchema } from './projectsCreateOrConnectWithoutCanvas_snapshotsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutCanvas_snapshotsInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutCanvas_snapshotsInput, Prisma.projectsCreateNestedOneWithoutCanvas_snapshotsInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutCanvas_snapshotsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutCanvas_snapshotsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutCanvas_snapshotsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
