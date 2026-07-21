// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { relationshipsUpsertWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsUpsertWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { relationshipsCreateManyMetric_cards_relationships_target_idTometric_cardsInputEnvelopeObjectSchema } from './relationshipsCreateManyMetric_cards_relationships_target_idTometric_cardsInputEnvelope.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsUpdateWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { relationshipsUpdateManyWithWhereWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsUpdateManyWithWhereWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { relationshipsScalarWhereInputObjectSchema } from './relationshipsScalarWhereInput.schema'

export const relationshipsUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInput, Prisma.relationshipsUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyMetric_cards_relationships_target_idTometric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationshipsUpdateManyWithWhereWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUpdateManyWithWhereWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationshipsScalarWhereInputObjectSchema), z.lazy(() => relationshipsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const relationshipsUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyMetric_cards_relationships_target_idTometric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationshipsUpdateManyWithWhereWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsUpdateManyWithWhereWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationshipsScalarWhereInputObjectSchema), z.lazy(() => relationshipsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
