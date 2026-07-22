// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateWithoutRelationshipsInputObjectSchema } from './evidence_itemsCreateWithoutRelationshipsInput.schema';
import { evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutRelationshipsInput.schema';
import { evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema } from './evidence_itemsCreateOrConnectWithoutRelationshipsInput.schema';
import { evidence_itemsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema } from './evidence_itemsUpsertWithWhereUniqueWithoutRelationshipsInput.schema';
import { evidence_itemsCreateManyRelationshipsInputEnvelopeObjectSchema } from './evidence_itemsCreateManyRelationshipsInputEnvelope.schema';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema } from './evidence_itemsUpdateWithWhereUniqueWithoutRelationshipsInput.schema';
import { evidence_itemsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema } from './evidence_itemsUpdateManyWithWhereWithoutRelationshipsInput.schema';
import { evidence_itemsScalarWhereInputObjectSchema } from './evidence_itemsScalarWhereInput.schema'

export const evidence_itemsUncheckedUpdateManyWithoutRelationshipsNestedInputObjectSchema: z.ZodType<Prisma.evidence_itemsUncheckedUpdateManyWithoutRelationshipsNestedInput, Prisma.evidence_itemsUncheckedUpdateManyWithoutRelationshipsNestedInput> = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const evidence_itemsUncheckedUpdateManyWithoutRelationshipsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyRelationshipsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
