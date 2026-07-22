// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInput.schema';
import { evidence_itemsUncheckedCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutUsers_evidence_items_owner_idTousersInput.schema'

export const evidence_itemsCreateOrConnectWithoutUsers_evidence_items_owner_idTousersInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateOrConnectWithoutUsers_evidence_items_owner_idTousersInput, Prisma.evidence_itemsCreateOrConnectWithoutUsers_evidence_items_owner_idTousersInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema)])
}).strict();
export const evidence_itemsCreateOrConnectWithoutUsers_evidence_items_owner_idTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema)])
}).strict();
