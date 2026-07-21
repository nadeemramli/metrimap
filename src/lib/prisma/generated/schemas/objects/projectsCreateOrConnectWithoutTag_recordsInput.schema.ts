// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutTag_recordsInputObjectSchema } from './projectsCreateWithoutTag_recordsInput.schema';
import { projectsUncheckedCreateWithoutTag_recordsInputObjectSchema } from './projectsUncheckedCreateWithoutTag_recordsInput.schema'

export const projectsCreateOrConnectWithoutTag_recordsInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutTag_recordsInput, Prisma.projectsCreateOrConnectWithoutTag_recordsInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutTag_recordsInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutTag_recordsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutTag_recordsInputObjectSchema)])
}).strict();
