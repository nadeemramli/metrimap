// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutGroupsInputObjectSchema } from './projectsUpdateWithoutGroupsInput.schema';
import { projectsUncheckedUpdateWithoutGroupsInputObjectSchema } from './projectsUncheckedUpdateWithoutGroupsInput.schema';
import { projectsCreateWithoutGroupsInputObjectSchema } from './projectsCreateWithoutGroupsInput.schema';
import { projectsUncheckedCreateWithoutGroupsInputObjectSchema } from './projectsUncheckedCreateWithoutGroupsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutGroupsInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutGroupsInput, Prisma.projectsUpsertWithoutGroupsInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutGroupsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutGroupsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutGroupsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutGroupsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutGroupsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
