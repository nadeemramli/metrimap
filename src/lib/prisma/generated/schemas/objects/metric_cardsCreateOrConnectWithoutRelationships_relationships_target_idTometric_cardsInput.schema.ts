// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInput.schema'

export const metric_cardsCreateOrConnectWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutRelationships_relationships_target_idTometric_cardsInput, Prisma.metric_cardsCreateOrConnectWithoutRelationships_relationships_target_idTometric_cardsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutRelationships_relationships_target_idTometric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema)])
}).strict();
