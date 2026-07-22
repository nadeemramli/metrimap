// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutAlert_rulesInputObjectSchema } from './projectsCreateWithoutAlert_rulesInput.schema';
import { projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema } from './projectsUncheckedCreateWithoutAlert_rulesInput.schema'

export const projectsCreateOrConnectWithoutAlert_rulesInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutAlert_rulesInput, Prisma.projectsCreateOrConnectWithoutAlert_rulesInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutAlert_rulesInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema)])
}).strict();
