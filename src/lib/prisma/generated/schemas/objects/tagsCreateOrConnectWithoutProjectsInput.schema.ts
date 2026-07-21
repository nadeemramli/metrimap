// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsCreateWithoutProjectsInputObjectSchema } from './tagsCreateWithoutProjectsInput.schema';
import { tagsUncheckedCreateWithoutProjectsInputObjectSchema } from './tagsUncheckedCreateWithoutProjectsInput.schema'

export const tagsCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.tagsCreateOrConnectWithoutProjectsInput, Prisma.tagsCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const tagsCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
