// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsWhereUniqueInputObjectSchema } from './groupsWhereUniqueInput.schema';
import { groupsUpdateWithoutProjectsInputObjectSchema } from './groupsUpdateWithoutProjectsInput.schema';
import { groupsUncheckedUpdateWithoutProjectsInputObjectSchema } from './groupsUncheckedUpdateWithoutProjectsInput.schema'

export const groupsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.groupsUpdateWithWhereUniqueWithoutProjectsInput, Prisma.groupsUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => groupsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const groupsUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => groupsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
