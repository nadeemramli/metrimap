// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema } from './relationshipsCreateWithoutMetric_cards_relationships_source_idTometric_cardsInput.schema';
import { relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema } from './relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInput.schema'

export const relationshipsCreateOrConnectWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema: z.ZodType<Prisma.relationshipsCreateOrConnectWithoutMetric_cards_relationships_source_idTometric_cardsInput, Prisma.relationshipsCreateOrConnectWithoutMetric_cards_relationships_source_idTometric_cardsInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema)])
}).strict();
export const relationshipsCreateOrConnectWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema)])
}).strict();
