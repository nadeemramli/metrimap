// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsScalarWhereInputObjectSchema } from './evidence_itemsScalarWhereInput.schema';
import { evidence_itemsUpdateManyMutationInputObjectSchema } from './evidence_itemsUpdateManyMutationInput.schema';
import { evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_owner_idTousersInput.schema'

export const evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_owner_idTousersInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_owner_idTousersInput, Prisma.evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_owner_idTousersInput> = z.object({
  where: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateManyMutationInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_owner_idTousersInputObjectSchema)])
}).strict();
export const evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_owner_idTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateManyMutationInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_owner_idTousersInputObjectSchema)])
}).strict();
