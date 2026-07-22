// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsUpdateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema } from './metric_cardsUpdateWithoutRelationships_relationships_source_idTometric_cardsInput.schema';
import { metric_cardsUncheckedUpdateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutRelationships_relationships_source_idTometric_cardsInput.schema'

export const metric_cardsUpdateToOneWithWhereWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateToOneWithWhereWithoutRelationships_relationships_source_idTometric_cardsInput, Prisma.metric_cardsUpdateToOneWithWhereWithoutRelationships_relationships_source_idTometric_cardsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema)])
}).strict();
export const metric_cardsUpdateToOneWithWhereWithoutRelationships_relationships_source_idTometric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema)])
}).strict();
