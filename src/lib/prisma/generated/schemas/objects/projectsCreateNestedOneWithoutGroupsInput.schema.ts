// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutGroupsInputObjectSchema } from './projectsCreateWithoutGroupsInput.schema';
import { projectsUncheckedCreateWithoutGroupsInputObjectSchema } from './projectsUncheckedCreateWithoutGroupsInput.schema';
import { projectsCreateOrConnectWithoutGroupsInputObjectSchema } from './projectsCreateOrConnectWithoutGroupsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutGroupsInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutGroupsInput, Prisma.projectsCreateNestedOneWithoutGroupsInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutGroupsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutGroupsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutGroupsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutGroupsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutGroupsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
