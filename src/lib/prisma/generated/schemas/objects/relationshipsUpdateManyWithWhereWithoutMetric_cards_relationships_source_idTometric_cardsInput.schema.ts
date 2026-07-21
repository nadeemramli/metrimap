// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsScalarWhereInputObjectSchema } from './relationshipsScalarWhereInput.schema';
import { relationshipsUpdateManyMutationInputObjectSchema } from './relationshipsUpdateManyMutationInput.schema';
import { relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema } from './relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsInput.schema'

export const relationshipsUpdateManyWithWhereWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateManyWithWhereWithoutMetric_cards_relationships_source_idTometric_cardsInput, Prisma.relationshipsUpdateManyWithWhereWithoutMetric_cards_relationships_source_idTometric_cardsInput> = z.object({
  where: z.lazy(() => relationshipsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateManyMutationInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema)])
}).strict();
export const relationshipsUpdateManyWithWhereWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateManyMutationInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema)])
}).strict();
