// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema';
import { tagsUpdateWithoutRelationship_tagsInputObjectSchema } from './tagsUpdateWithoutRelationship_tagsInput.schema';
import { tagsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema } from './tagsUncheckedUpdateWithoutRelationship_tagsInput.schema'

export const tagsUpdateToOneWithWhereWithoutRelationship_tagsInputObjectSchema: z.ZodType<Prisma.tagsUpdateToOneWithWhereWithoutRelationship_tagsInput, Prisma.tagsUpdateToOneWithWhereWithoutRelationship_tagsInput> = z.object({
  where: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tagsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)])
}).strict();
export const tagsUpdateToOneWithWhereWithoutRelationship_tagsInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tagsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)])
}).strict();
