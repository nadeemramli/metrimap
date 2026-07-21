// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsScalarWhereInputObjectSchema } from './tagsScalarWhereInput.schema';
import { tagsUpdateManyMutationInputObjectSchema } from './tagsUpdateManyMutationInput.schema';
import { tagsUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './tagsUncheckedUpdateManyWithoutProjectsInput.schema'

export const tagsUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.tagsUpdateManyWithWhereWithoutProjectsInput, Prisma.tagsUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => tagsUpdateManyMutationInputObjectSchema), z.lazy(() => tagsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const tagsUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => tagsUpdateManyMutationInputObjectSchema), z.lazy(() => tagsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
