// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsUpsertWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsUpsertWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelopeObjectSchema } from './evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelope.schema';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsUpdateWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsScalarWhereInputObjectSchema } from './evidence_itemsScalarWhereInput.schema'

export const evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInputObjectSchema: z.ZodType<Prisma.evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInput, Prisma.evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInput> = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
