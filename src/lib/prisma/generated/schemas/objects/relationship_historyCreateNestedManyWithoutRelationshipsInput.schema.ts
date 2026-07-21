// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyCreateWithoutRelationshipsInputObjectSchema } from './relationship_historyCreateWithoutRelationshipsInput.schema';
import { relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema } from './relationship_historyUncheckedCreateWithoutRelationshipsInput.schema';
import { relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema } from './relationship_historyCreateOrConnectWithoutRelationshipsInput.schema';
import { relationship_historyCreateManyRelationshipsInputEnvelopeObjectSchema } from './relationship_historyCreateManyRelationshipsInputEnvelope.schema';
import { relationship_historyWhereUniqueInputObjectSchema } from './relationship_historyWhereUniqueInput.schema'

export const relationship_historyCreateNestedManyWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_historyCreateNestedManyWithoutRelationshipsInput, Prisma.relationship_historyCreateNestedManyWithoutRelationshipsInput> = z.object({
  create: z.union([z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_historyCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const relationship_historyCreateNestedManyWithoutRelationshipsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_historyCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
