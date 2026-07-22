// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutCanvas_nodesInputObjectSchema } from './projectsCreateWithoutCanvas_nodesInput.schema';
import { projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema } from './projectsUncheckedCreateWithoutCanvas_nodesInput.schema'

export const projectsCreateOrConnectWithoutCanvas_nodesInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutCanvas_nodesInput, Prisma.projectsCreateOrConnectWithoutCanvas_nodesInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutCanvas_nodesInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutCanvas_nodesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutCanvas_nodesInputObjectSchema)])
}).strict();
