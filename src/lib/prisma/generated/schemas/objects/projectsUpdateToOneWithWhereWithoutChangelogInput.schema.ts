// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutChangelogInputObjectSchema } from './projectsUpdateWithoutChangelogInput.schema';
import { projectsUncheckedUpdateWithoutChangelogInputObjectSchema } from './projectsUncheckedUpdateWithoutChangelogInput.schema'

export const projectsUpdateToOneWithWhereWithoutChangelogInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutChangelogInput, Prisma.projectsUpdateToOneWithWhereWithoutChangelogInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutChangelogInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutChangelogInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutChangelogInputObjectSchema)])
}).strict();
