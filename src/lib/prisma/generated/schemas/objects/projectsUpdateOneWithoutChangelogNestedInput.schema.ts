// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutChangelogInputObjectSchema } from './projectsCreateWithoutChangelogInput.schema';
import { projectsUncheckedCreateWithoutChangelogInputObjectSchema } from './projectsUncheckedCreateWithoutChangelogInput.schema';
import { projectsCreateOrConnectWithoutChangelogInputObjectSchema } from './projectsCreateOrConnectWithoutChangelogInput.schema';
import { projectsUpsertWithoutChangelogInputObjectSchema } from './projectsUpsertWithoutChangelogInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutChangelogInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutChangelogInput.schema';
import { projectsUpdateWithoutChangelogInputObjectSchema } from './projectsUpdateWithoutChangelogInput.schema';
import { projectsUncheckedUpdateWithoutChangelogInputObjectSchema } from './projectsUncheckedUpdateWithoutChangelogInput.schema'

export const projectsUpdateOneWithoutChangelogNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneWithoutChangelogNestedInput, Prisma.projectsUpdateOneWithoutChangelogNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutChangelogInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutChangelogInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutChangelogInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutChangelogInputObjectSchema), z.lazy(() => projectsUpdateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutChangelogInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneWithoutChangelogNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutChangelogInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutChangelogInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutChangelogInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutChangelogInputObjectSchema), z.lazy(() => projectsUpdateWithoutChangelogInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutChangelogInputObjectSchema)]).optional()
}).strict();
