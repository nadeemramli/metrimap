// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutCanvas_snapshotsInputObjectSchema } from './projectsCreateWithoutCanvas_snapshotsInput.schema';
import { projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema } from './projectsUncheckedCreateWithoutCanvas_snapshotsInput.schema';
import { projectsCreateOrConnectWithoutCanvas_snapshotsInputObjectSchema } from './projectsCreateOrConnectWithoutCanvas_snapshotsInput.schema';
import { projectsUpsertWithoutCanvas_snapshotsInputObjectSchema } from './projectsUpsertWithoutCanvas_snapshotsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutCanvas_snapshotsInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutCanvas_snapshotsInput.schema';
import { projectsUpdateWithoutCanvas_snapshotsInputObjectSchema } from './projectsUpdateWithoutCanvas_snapshotsInput.schema';
import { projectsUncheckedUpdateWithoutCanvas_snapshotsInputObjectSchema } from './projectsUncheckedUpdateWithoutCanvas_snapshotsInput.schema'

export const projectsUpdateOneRequiredWithoutCanvas_snapshotsNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneRequiredWithoutCanvas_snapshotsNestedInput, Prisma.projectsUpdateOneRequiredWithoutCanvas_snapshotsNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutCanvas_snapshotsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutCanvas_snapshotsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUpdateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_snapshotsInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneRequiredWithoutCanvas_snapshotsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_snapshotsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutCanvas_snapshotsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutCanvas_snapshotsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUpdateWithoutCanvas_snapshotsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_snapshotsInputObjectSchema)]).optional()
}).strict();
