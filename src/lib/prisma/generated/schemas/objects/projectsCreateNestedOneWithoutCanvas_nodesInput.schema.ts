// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutCanvas_nodesInputObjectSchema } from './projectsCreateWithoutCanvas_nodesInput.schema';
import { projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema } from './projectsUncheckedCreateWithoutCanvas_nodesInput.schema';
import { projectsCreateOrConnectWithoutCanvas_nodesInputObjectSchema } from './projectsCreateOrConnectWithoutCanvas_nodesInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutCanvas_nodesInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutCanvas_nodesInput, Prisma.projectsCreateNestedOneWithoutCanvas_nodesInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutCanvas_nodesInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutCanvas_nodesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutCanvas_nodesInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
