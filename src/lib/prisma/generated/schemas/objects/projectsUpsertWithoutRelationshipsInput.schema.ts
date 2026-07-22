// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutRelationshipsInputObjectSchema } from './projectsUpdateWithoutRelationshipsInput.schema';
import { projectsUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './projectsUncheckedUpdateWithoutRelationshipsInput.schema';
import { projectsCreateWithoutRelationshipsInputObjectSchema } from './projectsCreateWithoutRelationshipsInput.schema';
import { projectsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './projectsUncheckedCreateWithoutRelationshipsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutRelationshipsInput, Prisma.projectsUpsertWithoutRelationshipsInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationshipsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationshipsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutRelationshipsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationshipsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationshipsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
