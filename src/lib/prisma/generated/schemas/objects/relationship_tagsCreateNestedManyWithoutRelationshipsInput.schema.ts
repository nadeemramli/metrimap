// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsCreateWithoutRelationshipsInputObjectSchema } from './relationship_tagsCreateWithoutRelationshipsInput.schema';
import { relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './relationship_tagsUncheckedCreateWithoutRelationshipsInput.schema';
import { relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema } from './relationship_tagsCreateOrConnectWithoutRelationshipsInput.schema';
import { relationship_tagsCreateManyRelationshipsInputEnvelopeObjectSchema } from './relationship_tagsCreateManyRelationshipsInputEnvelope.schema';
import { relationship_tagsWhereUniqueInputObjectSchema } from './relationship_tagsWhereUniqueInput.schema'

export const relationship_tagsCreateNestedManyWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateNestedManyWithoutRelationshipsInput, Prisma.relationship_tagsCreateNestedManyWithoutRelationshipsInput> = z.object({
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_tagsCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const relationship_tagsCreateNestedManyWithoutRelationshipsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_tagsCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema), z.lazy(() => relationship_tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
