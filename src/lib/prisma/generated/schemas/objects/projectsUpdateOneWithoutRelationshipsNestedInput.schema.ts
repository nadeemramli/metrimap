// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutRelationshipsInputObjectSchema } from './projectsCreateWithoutRelationshipsInput.schema';
import { projectsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './projectsUncheckedCreateWithoutRelationshipsInput.schema';
import { projectsCreateOrConnectWithoutRelationshipsInputObjectSchema } from './projectsCreateOrConnectWithoutRelationshipsInput.schema';
import { projectsUpsertWithoutRelationshipsInputObjectSchema } from './projectsUpsertWithoutRelationshipsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutRelationshipsInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutRelationshipsInput.schema';
import { projectsUpdateWithoutRelationshipsInputObjectSchema } from './projectsUpdateWithoutRelationshipsInput.schema';
import { projectsUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './projectsUncheckedUpdateWithoutRelationshipsInput.schema'

export const projectsUpdateOneWithoutRelationshipsNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneWithoutRelationshipsNestedInput, Prisma.projectsUpdateOneWithoutRelationshipsNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationshipsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutRelationshipsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutRelationshipsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationshipsInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneWithoutRelationshipsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationshipsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutRelationshipsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutRelationshipsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationshipsInputObjectSchema)]).optional()
}).strict();
