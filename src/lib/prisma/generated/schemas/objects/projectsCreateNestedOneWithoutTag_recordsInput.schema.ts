// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutTag_recordsInputObjectSchema } from './projectsCreateWithoutTag_recordsInput.schema';
import { projectsUncheckedCreateWithoutTag_recordsInputObjectSchema } from './projectsUncheckedCreateWithoutTag_recordsInput.schema';
import { projectsCreateOrConnectWithoutTag_recordsInputObjectSchema } from './projectsCreateOrConnectWithoutTag_recordsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutTag_recordsInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutTag_recordsInput, Prisma.projectsCreateNestedOneWithoutTag_recordsInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutTag_recordsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutTag_recordsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutTag_recordsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutTag_recordsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutTag_recordsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
