// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema } from './metric_cardsCreateWithoutRelationships_relationships_source_idTometric_cardsInput.schema';
import { metric_cardsUncheckedCreateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutRelationships_relationships_source_idTometric_cardsInput.schema';
import { metric_cardsCreateOrConnectWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutRelationships_relationships_source_idTometric_cardsInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsCreateNestedOneWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateNestedOneWithoutRelationships_relationships_source_idTometric_cardsInput, Prisma.metric_cardsCreateNestedOneWithoutRelationships_relationships_source_idTometric_cardsInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
export const metric_cardsCreateNestedOneWithoutRelationships_relationships_source_idTometric_cardsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
