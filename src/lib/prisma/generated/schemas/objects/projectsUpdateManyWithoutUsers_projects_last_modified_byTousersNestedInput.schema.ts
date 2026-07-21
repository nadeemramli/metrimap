// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsCreateWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsCreateOrConnectWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsCreateOrConnectWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsUpsertWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUpsertWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsCreateManyUsers_projects_last_modified_byTousersInputEnvelopeObjectSchema } from './projectsCreateManyUsers_projects_last_modified_byTousersInputEnvelope.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUpdateWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsUpdateManyWithWhereWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUpdateManyWithWhereWithoutUsers_projects_last_modified_byTousersInput.schema';
import { projectsScalarWhereInputObjectSchema } from './projectsScalarWhereInput.schema'

export const projectsUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInput, Prisma.projectsUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array(), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => projectsCreateOrConnectWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsCreateOrConnectWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => projectsUpsertWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUpsertWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => projectsCreateManyUsers_projects_last_modified_byTousersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => projectsUpdateWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUpdateWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => projectsUpdateManyWithWhereWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUpdateManyWithWhereWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => projectsScalarWhereInputObjectSchema), z.lazy(() => projectsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const projectsUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array(), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => projectsCreateOrConnectWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsCreateOrConnectWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => projectsUpsertWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUpsertWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => projectsCreateManyUsers_projects_last_modified_byTousersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => projectsUpdateWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUpdateWithWhereUniqueWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => projectsUpdateManyWithWhereWithoutUsers_projects_last_modified_byTousersInputObjectSchema), z.lazy(() => projectsUpdateManyWithWhereWithoutUsers_projects_last_modified_byTousersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => projectsScalarWhereInputObjectSchema), z.lazy(() => projectsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
