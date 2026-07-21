// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutRelationshipsInputObjectSchema } from './projectsUpdateWithoutRelationshipsInput.schema';
import { projectsUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './projectsUncheckedUpdateWithoutRelationshipsInput.schema'

export const projectsUpdateToOneWithWhereWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutRelationshipsInput, Prisma.projectsUpdateToOneWithWhereWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationshipsInputObjectSchema)])
}).strict();
