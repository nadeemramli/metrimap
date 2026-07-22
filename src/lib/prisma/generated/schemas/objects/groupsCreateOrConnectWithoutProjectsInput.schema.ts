// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsWhereUniqueInputObjectSchema } from './groupsWhereUniqueInput.schema';
import { groupsCreateWithoutProjectsInputObjectSchema } from './groupsCreateWithoutProjectsInput.schema';
import { groupsUncheckedCreateWithoutProjectsInputObjectSchema } from './groupsUncheckedCreateWithoutProjectsInput.schema'

export const groupsCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.groupsCreateOrConnectWithoutProjectsInput, Prisma.groupsCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const groupsCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
