// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsWhereUniqueInputObjectSchema } from './relationship_tagsWhereUniqueInput.schema';
import { relationship_tagsCreateWithoutRelationshipsInputObjectSchema } from './relationship_tagsCreateWithoutRelationshipsInput.schema';
import { relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './relationship_tagsUncheckedCreateWithoutRelationshipsInput.schema'

export const relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateOrConnectWithoutRelationshipsInput, Prisma.relationship_tagsCreateOrConnectWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
