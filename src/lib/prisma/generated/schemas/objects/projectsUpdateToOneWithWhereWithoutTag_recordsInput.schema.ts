// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutTag_recordsInputObjectSchema } from './projectsUpdateWithoutTag_recordsInput.schema';
import { projectsUncheckedUpdateWithoutTag_recordsInputObjectSchema } from './projectsUncheckedUpdateWithoutTag_recordsInput.schema'

export const projectsUpdateToOneWithWhereWithoutTag_recordsInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutTag_recordsInput, Prisma.projectsUpdateToOneWithWhereWithoutTag_recordsInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutTag_recordsInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutTag_recordsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutTag_recordsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutTag_recordsInputObjectSchema)])
}).strict();
