// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInput.schema';
import { evidence_itemsUncheckedCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutUsers_evidence_items_owner_idTousersInput.schema';
import { evidence_itemsCreateOrConnectWithoutUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsCreateOrConnectWithoutUsers_evidence_items_owner_idTousersInput.schema';
import { evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputEnvelopeObjectSchema } from './evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputEnvelope.schema';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema'

export const evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInputObjectSchema: z.ZodType<Prisma.evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInput, Prisma.evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInput> = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_owner_idTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutUsers_evidence_items_owner_idTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
