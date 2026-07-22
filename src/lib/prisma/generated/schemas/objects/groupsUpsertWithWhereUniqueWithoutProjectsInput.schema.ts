// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsWhereUniqueInputObjectSchema } from './groupsWhereUniqueInput.schema';
import { groupsUpdateWithoutProjectsInputObjectSchema } from './groupsUpdateWithoutProjectsInput.schema';
import { groupsUncheckedUpdateWithoutProjectsInputObjectSchema } from './groupsUncheckedUpdateWithoutProjectsInput.schema';
import { groupsCreateWithoutProjectsInputObjectSchema } from './groupsCreateWithoutProjectsInput.schema';
import { groupsUncheckedCreateWithoutProjectsInputObjectSchema } from './groupsUncheckedCreateWithoutProjectsInput.schema'

export const groupsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.groupsUpsertWithWhereUniqueWithoutProjectsInput, Prisma.groupsUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => groupsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const groupsUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => groupsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
