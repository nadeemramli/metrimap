// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutSpacesInputObjectSchema } from './projectsCreateWithoutSpacesInput.schema';
import { projectsUncheckedCreateWithoutSpacesInputObjectSchema } from './projectsUncheckedCreateWithoutSpacesInput.schema';
import { projectsCreateOrConnectWithoutSpacesInputObjectSchema } from './projectsCreateOrConnectWithoutSpacesInput.schema';
import { projectsCreateManySpacesInputEnvelopeObjectSchema } from './projectsCreateManySpacesInputEnvelope.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedManyWithoutSpacesInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedManyWithoutSpacesInput, Prisma.projectsCreateNestedManyWithoutSpacesInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema).array(), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => projectsCreateOrConnectWithoutSpacesInputObjectSchema), z.lazy(() => projectsCreateOrConnectWithoutSpacesInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => projectsCreateManySpacesInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const projectsCreateNestedManyWithoutSpacesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema).array(), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => projectsCreateOrConnectWithoutSpacesInputObjectSchema), z.lazy(() => projectsCreateOrConnectWithoutSpacesInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => projectsCreateManySpacesInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => projectsWhereUniqueInputObjectSchema), z.lazy(() => projectsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
