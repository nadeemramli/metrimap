// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutProject_collaboratorsInputObjectSchema } from './projectsCreateWithoutProject_collaboratorsInput.schema';
import { projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema } from './projectsUncheckedCreateWithoutProject_collaboratorsInput.schema';
import { projectsCreateOrConnectWithoutProject_collaboratorsInputObjectSchema } from './projectsCreateOrConnectWithoutProject_collaboratorsInput.schema';
import { projectsUpsertWithoutProject_collaboratorsInputObjectSchema } from './projectsUpsertWithoutProject_collaboratorsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutProject_collaboratorsInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutProject_collaboratorsInput.schema';
import { projectsUpdateWithoutProject_collaboratorsInputObjectSchema } from './projectsUpdateWithoutProject_collaboratorsInput.schema';
import { projectsUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema } from './projectsUncheckedUpdateWithoutProject_collaboratorsInput.schema'

export const projectsUpdateOneWithoutProject_collaboratorsNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneWithoutProject_collaboratorsNestedInput, Prisma.projectsUpdateOneWithoutProject_collaboratorsNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutProject_collaboratorsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutProject_collaboratorsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneWithoutProject_collaboratorsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutProject_collaboratorsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutProject_collaboratorsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)]).optional()
}).strict();
