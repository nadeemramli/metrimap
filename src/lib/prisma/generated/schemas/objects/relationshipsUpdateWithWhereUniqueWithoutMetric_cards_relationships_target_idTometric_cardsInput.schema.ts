// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsUpdateWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { relationshipsUncheckedUpdateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsUncheckedUpdateWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema'

export const relationshipsUpdateWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInput, Prisma.relationshipsUpdateWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema)])
}).strict();
export const relationshipsUpdateWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema)])
}).strict();
