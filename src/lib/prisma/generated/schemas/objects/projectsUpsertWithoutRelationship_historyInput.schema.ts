// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutRelationship_historyInputObjectSchema } from './projectsUpdateWithoutRelationship_historyInput.schema';
import { projectsUncheckedUpdateWithoutRelationship_historyInputObjectSchema } from './projectsUncheckedUpdateWithoutRelationship_historyInput.schema';
import { projectsCreateWithoutRelationship_historyInputObjectSchema } from './projectsCreateWithoutRelationship_historyInput.schema';
import { projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema } from './projectsUncheckedCreateWithoutRelationship_historyInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutRelationship_historyInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutRelationship_historyInput, Prisma.projectsUpsertWithoutRelationship_historyInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutRelationship_historyInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
