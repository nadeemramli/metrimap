// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutGroupsInputObjectSchema } from './projectsUpdateWithoutGroupsInput.schema';
import { projectsUncheckedUpdateWithoutGroupsInputObjectSchema } from './projectsUncheckedUpdateWithoutGroupsInput.schema'

export const projectsUpdateToOneWithWhereWithoutGroupsInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutGroupsInput, Prisma.projectsUpdateToOneWithWhereWithoutGroupsInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutGroupsInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutGroupsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutGroupsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutGroupsInputObjectSchema)])
}).strict();
