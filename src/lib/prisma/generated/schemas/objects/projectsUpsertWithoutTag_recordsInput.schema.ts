// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutTag_recordsInputObjectSchema } from './projectsUpdateWithoutTag_recordsInput.schema';
import { projectsUncheckedUpdateWithoutTag_recordsInputObjectSchema } from './projectsUncheckedUpdateWithoutTag_recordsInput.schema';
import { projectsCreateWithoutTag_recordsInputObjectSchema } from './projectsCreateWithoutTag_recordsInput.schema';
import { projectsUncheckedCreateWithoutTag_recordsInputObjectSchema } from './projectsUncheckedCreateWithoutTag_recordsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutTag_recordsInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutTag_recordsInput, Prisma.projectsUpsertWithoutTag_recordsInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutTag_recordsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutTag_recordsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutTag_recordsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutTag_recordsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutTag_recordsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
