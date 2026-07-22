// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutCanvas_nodesInputObjectSchema } from './projectsCreateWithoutCanvas_nodesInput.schema';
import { projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema } from './projectsUncheckedCreateWithoutCanvas_nodesInput.schema';
import { projectsCreateOrConnectWithoutCanvas_nodesInputObjectSchema } from './projectsCreateOrConnectWithoutCanvas_nodesInput.schema';
import { projectsUpsertWithoutCanvas_nodesInputObjectSchema } from './projectsUpsertWithoutCanvas_nodesInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutCanvas_nodesInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutCanvas_nodesInput.schema';
import { projectsUpdateWithoutCanvas_nodesInputObjectSchema } from './projectsUpdateWithoutCanvas_nodesInput.schema';
import { projectsUncheckedUpdateWithoutCanvas_nodesInputObjectSchema } from './projectsUncheckedUpdateWithoutCanvas_nodesInput.schema'

export const projectsUpdateOneRequiredWithoutCanvas_nodesNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneRequiredWithoutCanvas_nodesNestedInput, Prisma.projectsUpdateOneRequiredWithoutCanvas_nodesNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutCanvas_nodesInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutCanvas_nodesInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUpdateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_nodesInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneRequiredWithoutCanvas_nodesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutCanvas_nodesInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutCanvas_nodesInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUpdateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutCanvas_nodesInputObjectSchema)]).optional()
}).strict();
