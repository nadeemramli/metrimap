// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutSpacesInputObjectSchema } from './projectsCreateWithoutSpacesInput.schema';
import { projectsUncheckedCreateWithoutSpacesInputObjectSchema } from './projectsUncheckedCreateWithoutSpacesInput.schema';
import { projectsCreateOrConnectWithoutSpacesInputObjectSchema } from './projectsCreateOrConnectWithoutSpacesInput.schema';
import { projectsUpsertWithWhereUniqueWithoutSpacesInputObjectSchema } from './projectsUpsertWithWhereUniqueWithoutSpacesInput.schema';
import { projectsCreateManySpacesInputEnvelopeObjectSchema } from './projectsCreateManySpacesInputEnvelope.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateWithWhereUniqueWithoutSpacesInputObjectSchema } from './projectsUpdateWithWhereUniqueWithoutSpacesInput.schema';
import { projectsUpdateManyWithWhereWithoutSpacesInputObjectSchema } from './projectsUpdateManyWithWhereWithoutSpacesInput.schema';
import { projectsScalarWhereInputObjectSchema } from './projectsScalarWhereInput.schema'

export const projectsUncheckedUpdateManyWithoutSpacesNestedInputObjectSchema: z.ZodType<Prisma.projectsUncheckedUpdateManyWithoutSpacesNestedInput, Prisma.projectsUncheckedUpdateManyWithoutSpacesNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema).array(), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => projectsCreateOrConnectWithoutSpacesInputObjectSchema), z.lazy(() => projectsCreateOrConnectWithoutSpacesInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => projectsUpsertWithWhereUniqueWithoutSpacesInputObjectSchema), z.lazy(() => projectsUpsertWithWhereUniqueWithoutSpacesInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => projectsCreateManySpacesInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => projectsUpdateWithWhereUniqueWithoutSpacesInputObjectSchema), z.lazy(() => projectsUpdateWithWhereUniqueWithoutSpacesInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => projectsUpdateManyWithWhereWithoutSpacesInputObjectSchema), z.lazy(() => projectsUpdateManyWithWhereWithoutSpacesInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => projectsScalarWhereInputObjectSchema), z.lazy(() => projectsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const projectsUncheckedUpdateManyWithoutSpacesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema).array(), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => projectsCreateOrConnectWithoutSpacesInputObjectSchema), z.lazy(() => projectsCreateOrConnectWithoutSpacesInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => projectsUpsertWithWhereUniqueWithoutSpacesInputObjectSchema), z.lazy(() => projectsUpsertWithWhereUniqueWithoutSpacesInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => projectsCreateManySpacesInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => projectsUpdateWithWhereUniqueWithoutSpacesInputObjectSchema), z.lazy(() => projectsUpdateWithWhereUniqueWithoutSpacesInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => projectsUpdateManyWithWhereWithoutSpacesInputObjectSchema), z.lazy(() => projectsUpdateManyWithWhereWithoutSpacesInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => projectsScalarWhereInputObjectSchema), z.lazy(() => projectsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
