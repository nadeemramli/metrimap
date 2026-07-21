// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsUpdateWithoutUsers_evidence_items_owner_idTousersInput.schema';
import { evidence_itemsUncheckedUpdateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsUncheckedUpdateWithoutUsers_evidence_items_owner_idTousersInput.schema'

export const evidence_itemsUpdateWithWhereUniqueWithoutUsers_evidence_items_owner_idTousersInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpdateWithWhereUniqueWithoutUsers_evidence_items_owner_idTousersInput, Prisma.evidence_itemsUpdateWithWhereUniqueWithoutUsers_evidence_items_owner_idTousersInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema)])
}).strict();
export const evidence_itemsUpdateWithWhereUniqueWithoutUsers_evidence_items_owner_idTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutUsers_evidence_items_owner_idTousersInputObjectSchema)])
}).strict();
