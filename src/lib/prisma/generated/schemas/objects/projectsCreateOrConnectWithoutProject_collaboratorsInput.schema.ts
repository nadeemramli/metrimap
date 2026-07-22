// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutProject_collaboratorsInputObjectSchema } from './projectsCreateWithoutProject_collaboratorsInput.schema';
import { projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema } from './projectsUncheckedCreateWithoutProject_collaboratorsInput.schema'

export const projectsCreateOrConnectWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutProject_collaboratorsInput, Prisma.projectsCreateOrConnectWithoutProject_collaboratorsInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)])
}).strict();
