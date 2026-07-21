// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutChangelogInputObjectSchema } from './projectsCreateWithoutChangelogInput.schema';
import { projectsUncheckedCreateWithoutChangelogInputObjectSchema } from './projectsUncheckedCreateWithoutChangelogInput.schema';
import { projectsCreateOrConnectWithoutChangelogInputObjectSchema } from './projectsCreateOrConnectWithoutChangelogInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutChangelogInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutChangelogInput, Prisma.projectsCreateNestedOneWithoutChangelogInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutChangelogInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutChangelogInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutChangelogInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutChangelogInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutChangelogInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
