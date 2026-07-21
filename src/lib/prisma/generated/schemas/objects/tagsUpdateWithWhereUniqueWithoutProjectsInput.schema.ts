// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsUpdateWithoutProjectsInputObjectSchema } from './tagsUpdateWithoutProjectsInput.schema';
import { tagsUncheckedUpdateWithoutProjectsInputObjectSchema } from './tagsUncheckedUpdateWithoutProjectsInput.schema'

export const tagsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.tagsUpdateWithWhereUniqueWithoutProjectsInput, Prisma.tagsUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => tagsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const tagsUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => tagsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
