// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutGroupsInputObjectSchema } from './projectsCreateWithoutGroupsInput.schema';
import { projectsUncheckedCreateWithoutGroupsInputObjectSchema } from './projectsUncheckedCreateWithoutGroupsInput.schema'

export const projectsCreateOrConnectWithoutGroupsInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutGroupsInput, Prisma.projectsCreateOrConnectWithoutGroupsInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutGroupsInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutGroupsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutGroupsInputObjectSchema)])
}).strict();
