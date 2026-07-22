// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsCreateOrConnectWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsUpsertWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsUpsertWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateToOneWithWhereWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsUpdateToOneWithWhereWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsUpdateWithoutRelationships_relationships_target_idTometric_cardsInput.schema';
import { metric_cardsUncheckedUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutRelationships_relationships_target_idTometric_cardsInput.schema'

export const metric_cardsUpdateOneWithoutRelationships_relationships_target_idTometric_cardsNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateOneWithoutRelationships_relationships_target_idTometric_cardsNestedInput, Prisma.metric_cardsUpdateOneWithoutRelationships_relationships_target_idTometric_cardsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema)]).optional()
}).strict();
export const metric_cardsUpdateOneWithoutRelationships_relationships_target_idTometric_cardsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema)]).optional()
}).strict();
