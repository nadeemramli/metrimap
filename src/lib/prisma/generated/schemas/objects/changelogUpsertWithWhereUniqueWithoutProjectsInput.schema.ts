// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogWhereUniqueInputObjectSchema } from './changelogWhereUniqueInput.schema';
import { changelogUpdateWithoutProjectsInputObjectSchema } from './changelogUpdateWithoutProjectsInput.schema';
import { changelogUncheckedUpdateWithoutProjectsInputObjectSchema } from './changelogUncheckedUpdateWithoutProjectsInput.schema';
import { changelogCreateWithoutProjectsInputObjectSchema } from './changelogCreateWithoutProjectsInput.schema';
import { changelogUncheckedCreateWithoutProjectsInputObjectSchema } from './changelogUncheckedCreateWithoutProjectsInput.schema'

export const changelogUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.changelogUpsertWithWhereUniqueWithoutProjectsInput, Prisma.changelogUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => changelogUpdateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const changelogUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => changelogUpdateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
