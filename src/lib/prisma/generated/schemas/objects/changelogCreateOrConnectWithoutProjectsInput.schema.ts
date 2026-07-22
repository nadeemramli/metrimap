// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogWhereUniqueInputObjectSchema } from './changelogWhereUniqueInput.schema';
import { changelogCreateWithoutProjectsInputObjectSchema } from './changelogCreateWithoutProjectsInput.schema';
import { changelogUncheckedCreateWithoutProjectsInputObjectSchema } from './changelogUncheckedCreateWithoutProjectsInput.schema'

export const changelogCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.changelogCreateOrConnectWithoutProjectsInput, Prisma.changelogCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const changelogCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
