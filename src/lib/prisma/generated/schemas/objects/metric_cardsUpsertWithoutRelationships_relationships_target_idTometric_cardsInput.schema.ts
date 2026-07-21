// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsUpdateWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsUncheckedUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const metric_cardsUpsertWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpsertWithoutRelationships_relationships_target_idTometric_cardsInput, Prisma.metric_cardsUpsertWithoutRelationships_relationships_target_idTometric_cardsInput> = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
export const metric_cardsUpsertWithoutRelationships_relationships_target_idTometric_cardsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
