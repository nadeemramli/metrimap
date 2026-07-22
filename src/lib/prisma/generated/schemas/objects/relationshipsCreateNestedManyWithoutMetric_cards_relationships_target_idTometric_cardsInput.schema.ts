// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { relationshipsCreateManyMetric_cards_relationships_target_idTometric_cardsInputEnvelopeObjectSchema } from './relationshipsCreateManyMetric_cards_relationships_target_idTometric_cardsInputEnvelope.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema'

export const relationshipsCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema: z.ZodType<Prisma.relationshipsCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInput, Prisma.relationshipsCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyMetric_cards_relationships_target_idTometric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const relationshipsCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyMetric_cards_relationships_target_idTometric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
