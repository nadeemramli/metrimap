// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutUsers_projects_created_byTousersInputObjectSchema } from './projectsCreateWithoutUsers_projects_created_byTousersInput.schema';
import { projectsUncheckedCreateWithoutUsers_projects_created_byTousersInputObjectSchema } from './projectsUncheckedCreateWithoutUsers_projects_created_byTousersInput.schema';
import { projectsCreateOrConnectWithoutUsers_projects_created_byTousersInputObjectSchema } from './projectsCreateOrConnectWithoutUsers_projects_created_byTousersInput.schema';
import { projectsCreateManyUsers_projects_created_byTousersInputEnvelopeObjectSchema } from './projectsCreateManyUsers_projects_created_byTousersInputEnvelope.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedManyWithoutUsers_projects_created_byTousersInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedManyWithoutUsers_projects_created_byTousersInput, Prisma.projectsCreateNestedManyWithoutUsers_projects_created_byTousersInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsCreateWithoutUsers_projects_created_byTousersInputObjectSchema).array(), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_created_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => projectsCreateOrConnectWithoutUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsCreateOrConnectWithoutUsers_projects_created_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => projectsCreateManyUsers_projects_created_byTousersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const projectsCreateNestedManyWithoutUsers_projects_created_byTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsCreateWithoutUsers_projects_created_byTousersInputObjectSchema).array(), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_created_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => projectsCreateOrConnectWithoutUsers_projects_created_byTousersInputObjectSchema), z.lazy(() => projectsCreateOrConnectWithoutUsers_projects_created_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => projectsCreateManyUsers_projects_created_byTousersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
