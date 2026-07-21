// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema } from './relationshipsUpdateWithoutMetric_cards_relationships_source_idTometric_cardsInput.schema';
import { relationshipsUncheckedUpdateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema } from './relationshipsUncheckedUpdateWithoutMetric_cards_relationships_source_idTometric_cardsInput.schema';
import { relationshipsCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema } from './relationshipsCreateWithoutMetric_cards_relationships_source_idTometric_cardsInput.schema';
import { relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema } from './relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInput.schema'

export const relationshipsUpsertWithWhereUniqueWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema: z.ZodType<Prisma.relationshipsUpsertWithWhereUniqueWithoutMetric_cards_relationships_source_idTometric_cardsInput, Prisma.relationshipsUpsertWithWhereUniqueWithoutMetric_cards_relationships_source_idTometric_cardsInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationshipsUpdateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema)])
}).strict();
export const relationshipsUpsertWithWhereUniqueWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationshipsUpdateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema)])
}).strict();
