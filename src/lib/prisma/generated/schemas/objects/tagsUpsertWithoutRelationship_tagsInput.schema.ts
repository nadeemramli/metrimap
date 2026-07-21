// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsUpdateWithoutRelationship_tagsInputObjectSchema } from './tagsUpdateWithoutRelationship_tagsInput.schema';
import { tagsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema } from './tagsUncheckedUpdateWithoutRelationship_tagsInput.schema';
import { tagsCreateWithoutRelationship_tagsInputObjectSchema } from './tagsCreateWithoutRelationship_tagsInput.schema';
import { tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema } from './tagsUncheckedCreateWithoutRelationship_tagsInput.schema';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema'

export const tagsUpsertWithoutRelationship_tagsInputObjectSchema: z.ZodType<Prisma.tagsUpsertWithoutRelationship_tagsInput, Prisma.tagsUpsertWithoutRelationship_tagsInput> = z.object({
  update: z.union([z.lazy(() => tagsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)]),
  create: z.union([z.lazy(() => tagsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]),
  where: z.lazy(() => tagsWhereInputObjectSchema).optional()
}).strict();
export const tagsUpsertWithoutRelationship_tagsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => tagsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)]),
  create: z.union([z.lazy(() => tagsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]),
  where: z.lazy(() => tagsWhereInputObjectSchema).optional()
}).strict();
