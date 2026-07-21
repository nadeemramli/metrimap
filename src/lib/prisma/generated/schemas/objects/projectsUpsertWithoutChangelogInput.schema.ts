// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutChangelogInputObjectSchema } from './projectsUpdateWithoutChangelogInput.schema';
import { projectsUncheckedUpdateWithoutChangelogInputObjectSchema } from './projectsUncheckedUpdateWithoutChangelogInput.schema';
import { projectsCreateWithoutChangelogInputObjectSchema } from './projectsCreateWithoutChangelogInput.schema';
import { projectsUncheckedCreateWithoutChangelogInputObjectSchema } from './projectsUncheckedCreateWithoutChangelogInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutChangelogInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutChangelogInput, Prisma.projectsUpsertWithoutChangelogInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutChangelogInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutChangelogInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutChangelogInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutChangelogInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutChangelogInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
