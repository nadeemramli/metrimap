// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsWhereUniqueInputObjectSchema } from './relationship_tagsWhereUniqueInput.schema';
import { relationship_tagsUpdateWithoutRelationshipsInputObjectSchema } from './relationship_tagsUpdateWithoutRelationshipsInput.schema';
import { relationship_tagsUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './relationship_tagsUncheckedUpdateWithoutRelationshipsInput.schema';
import { relationship_tagsCreateWithoutRelationshipsInputObjectSchema } from './relationship_tagsCreateWithoutRelationshipsInput.schema';
import { relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './relationship_tagsUncheckedCreateWithoutRelationshipsInput.schema'

export const relationship_tagsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpsertWithWhereUniqueWithoutRelationshipsInput, Prisma.relationship_tagsUpsertWithWhereUniqueWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationship_tagsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateWithoutRelationshipsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const relationship_tagsUpsertWithWhereUniqueWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationship_tagsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateWithoutRelationshipsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
