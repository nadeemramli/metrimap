// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutProject_collaboratorsInputObjectSchema } from './projectsCreateWithoutProject_collaboratorsInput.schema';
import { projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema } from './projectsUncheckedCreateWithoutProject_collaboratorsInput.schema';
import { projectsCreateOrConnectWithoutProject_collaboratorsInputObjectSchema } from './projectsCreateOrConnectWithoutProject_collaboratorsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutProject_collaboratorsInput, Prisma.projectsCreateNestedOneWithoutProject_collaboratorsInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutProject_collaboratorsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutProject_collaboratorsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
