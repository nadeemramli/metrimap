// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsUpdateWithoutProjectsInputObjectSchema } from './tagsUpdateWithoutProjectsInput.schema';
import { tagsUncheckedUpdateWithoutProjectsInputObjectSchema } from './tagsUncheckedUpdateWithoutProjectsInput.schema';
import { tagsCreateWithoutProjectsInputObjectSchema } from './tagsCreateWithoutProjectsInput.schema';
import { tagsUncheckedCreateWithoutProjectsInputObjectSchema } from './tagsUncheckedCreateWithoutProjectsInput.schema'

export const tagsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.tagsUpsertWithWhereUniqueWithoutProjectsInput, Prisma.tagsUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => tagsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const tagsUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => tagsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
