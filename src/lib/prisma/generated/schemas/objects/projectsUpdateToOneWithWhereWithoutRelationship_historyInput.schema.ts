// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutRelationship_historyInputObjectSchema } from './projectsUpdateWithoutRelationship_historyInput.schema';
import { projectsUncheckedUpdateWithoutRelationship_historyInputObjectSchema } from './projectsUncheckedUpdateWithoutRelationship_historyInput.schema'

export const projectsUpdateToOneWithWhereWithoutRelationship_historyInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutRelationship_historyInput, Prisma.projectsUpdateToOneWithWhereWithoutRelationship_historyInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutRelationship_historyInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)])
}).strict();
