// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsWhereUniqueInputObjectSchema } from './relationship_tagsWhereUniqueInput.schema';
import { relationship_tagsUpdateWithoutRelationshipsInputObjectSchema } from './relationship_tagsUpdateWithoutRelationshipsInput.schema';
import { relationship_tagsUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './relationship_tagsUncheckedUpdateWithoutRelationshipsInput.schema'

export const relationship_tagsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpdateWithWhereUniqueWithoutRelationshipsInput, Prisma.relationship_tagsUpdateWithWhereUniqueWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationship_tagsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const relationship_tagsUpdateWithWhereUniqueWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationship_tagsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateWithoutRelationshipsInputObjectSchema)])
}).strict();
