// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsCreateWithoutRelationshipsInputObjectSchema } from './relationship_tagsCreateWithoutRelationshipsInput.schema';
import { relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './relationship_tagsUncheckedCreateWithoutRelationshipsInput.schema';
import { relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema } from './relationship_tagsCreateOrConnectWithoutRelationshipsInput.schema';
import { relationship_tagsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema } from './relationship_tagsUpsertWithWhereUniqueWithoutRelationshipsInput.schema';
import { relationship_tagsCreateManyRelationshipsInputEnvelopeObjectSchema } from './relationship_tagsCreateManyRelationshipsInputEnvelope.schema';
import { relationship_tagsWhereUniqueInputObjectSchema } from './relationship_tagsWhereUniqueInput.schema';
import { relationship_tagsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema } from './relationship_tagsUpdateWithWhereUniqueWithoutRelationshipsInput.schema';
import { relationship_tagsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema } from './relationship_tagsUpdateManyWithWhereWithoutRelationshipsInput.schema';
import { relationship_tagsScalarWhereInputObjectSchema } from './relationship_tagsScalarWhereInput.schema'

export const relationship_tagsUpdateManyWithoutRelationshipsNestedInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpdateManyWithoutRelationshipsNestedInput, Prisma.relationship_tagsUpdateManyWithoutRelationshipsNestedInput> = z.object({
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationship_tagsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_tagsCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationship_tagsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationship_tagsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationship_tagsScalarWhereInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const relationship_tagsUpdateManyWithoutRelationshipsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationship_tagsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_tagsCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationship_tagsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationship_tagsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationship_tagsScalarWhereInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
