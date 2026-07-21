// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutAlert_rulesInputObjectSchema } from './projectsCreateWithoutAlert_rulesInput.schema';
import { projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema } from './projectsUncheckedCreateWithoutAlert_rulesInput.schema';
import { projectsCreateOrConnectWithoutAlert_rulesInputObjectSchema } from './projectsCreateOrConnectWithoutAlert_rulesInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutAlert_rulesInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutAlert_rulesInput, Prisma.projectsCreateNestedOneWithoutAlert_rulesInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutAlert_rulesInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutAlert_rulesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutAlert_rulesInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
