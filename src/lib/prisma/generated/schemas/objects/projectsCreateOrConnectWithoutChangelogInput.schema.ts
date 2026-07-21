// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutChangelogInputObjectSchema } from './projectsCreateWithoutChangelogInput.schema';
import { projectsUncheckedCreateWithoutChangelogInputObjectSchema } from './projectsUncheckedCreateWithoutChangelogInput.schema'

export const projectsCreateOrConnectWithoutChangelogInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutChangelogInput, Prisma.projectsCreateOrConnectWithoutChangelogInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutChangelogInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutChangelogInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutChangelogInputObjectSchema)])
}).strict();
