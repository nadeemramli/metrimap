// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyCreateWithoutRelationshipsInputObjectSchema } from './relationship_historyCreateWithoutRelationshipsInput.schema';
import { relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema } from './relationship_historyUncheckedCreateWithoutRelationshipsInput.schema';
import { relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema } from './relationship_historyCreateOrConnectWithoutRelationshipsInput.schema';
import { relationship_historyUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema } from './relationship_historyUpsertWithWhereUniqueWithoutRelationshipsInput.schema';
import { relationship_historyCreateManyRelationshipsInputEnvelopeObjectSchema } from './relationship_historyCreateManyRelationshipsInputEnvelope.schema';
import { relationship_historyWhereUniqueInputObjectSchema } from './relationship_historyWhereUniqueInput.schema';
import { relationship_historyUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema } from './relationship_historyUpdateWithWhereUniqueWithoutRelationshipsInput.schema';
import { relationship_historyUpdateManyWithWhereWithoutRelationshipsInputObjectSchema } from './relationship_historyUpdateManyWithWhereWithoutRelationshipsInput.schema';
import { relationship_historyScalarWhereInputObjectSchema } from './relationship_historyScalarWhereInput.schema'

export const relationship_historyUpdateManyWithoutRelationshipsNestedInputObjectSchema: z.ZodType<Prisma.relationship_historyUpdateManyWithoutRelationshipsNestedInput, Prisma.relationship_historyUpdateManyWithoutRelationshipsNestedInput> = z.object({
  create: z.union([z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationship_historyUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_historyCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationship_historyUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationship_historyUpdateManyWithWhereWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUpdateManyWithWhereWithoutRelationshipsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationship_historyScalarWhereInputObjectSchema), z.lazy(() => relationship_historyScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const relationship_historyUpdateManyWithoutRelationshipsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationship_historyUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_historyCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationship_historyUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationship_historyUpdateManyWithWhereWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUpdateManyWithWhereWithoutRelationshipsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationship_historyScalarWhereInputObjectSchema), z.lazy(() => relationship_historyScalarWhereInputObjectSchema).array()]).optional()
}).strict();
