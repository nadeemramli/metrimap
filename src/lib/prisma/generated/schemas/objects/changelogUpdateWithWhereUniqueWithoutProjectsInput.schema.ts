// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogWhereUniqueInputObjectSchema } from './changelogWhereUniqueInput.schema';
import { changelogUpdateWithoutProjectsInputObjectSchema } from './changelogUpdateWithoutProjectsInput.schema';
import { changelogUncheckedUpdateWithoutProjectsInputObjectSchema } from './changelogUncheckedUpdateWithoutProjectsInput.schema'

export const changelogUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.changelogUpdateWithWhereUniqueWithoutProjectsInput, Prisma.changelogUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => changelogUpdateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const changelogUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => changelogUpdateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
