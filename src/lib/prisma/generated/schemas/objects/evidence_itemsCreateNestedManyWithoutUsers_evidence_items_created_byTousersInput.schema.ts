// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelopeObjectSchema } from './evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelope.schema';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema'

export const evidence_itemsCreateNestedManyWithoutUsers_evidence_items_created_byTousersInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateNestedManyWithoutUsers_evidence_items_created_byTousersInput, Prisma.evidence_itemsCreateNestedManyWithoutUsers_evidence_items_created_byTousersInput> = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const evidence_itemsCreateNestedManyWithoutUsers_evidence_items_created_byTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_created_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
