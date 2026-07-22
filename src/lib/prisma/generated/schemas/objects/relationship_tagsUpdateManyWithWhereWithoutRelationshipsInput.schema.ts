// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsScalarWhereInputObjectSchema } from './relationship_tagsScalarWhereInput.schema';
import { relationship_tagsUpdateManyMutationInputObjectSchema } from './relationship_tagsUpdateManyMutationInput.schema';
import { relationship_tagsUncheckedUpdateManyWithoutRelationshipsInputObjectSchema } from './relationship_tagsUncheckedUpdateManyWithoutRelationshipsInput.schema'

export const relationship_tagsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpdateManyWithWhereWithoutRelationshipsInput, Prisma.relationship_tagsUpdateManyWithWhereWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => relationship_tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationship_tagsUpdateManyMutationInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateManyWithoutRelationshipsInputObjectSchema)])
}).strict();
export const relationship_tagsUpdateManyWithWhereWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationship_tagsUpdateManyMutationInputObjectSchema), z.lazy(() => relationship_tagsUncheckedUpdateManyWithoutRelationshipsInputObjectSchema)])
}).strict();
