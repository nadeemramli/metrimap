// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateWithoutRelationshipsInputObjectSchema } from './evidence_itemsCreateWithoutRelationshipsInput.schema';
import { evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutRelationshipsInput.schema';
import { evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema } from './evidence_itemsCreateOrConnectWithoutRelationshipsInput.schema';
import { evidence_itemsCreateManyRelationshipsInputEnvelopeObjectSchema } from './evidence_itemsCreateManyRelationshipsInputEnvelope.schema';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema'

export const evidence_itemsCreateNestedManyWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateNestedManyWithoutRelationshipsInput, Prisma.evidence_itemsCreateNestedManyWithoutRelationshipsInput> = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const evidence_itemsCreateNestedManyWithoutRelationshipsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
