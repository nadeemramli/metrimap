// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsScalarWhereInputObjectSchema } from './evidence_itemsScalarWhereInput.schema';
import { evidence_itemsUpdateManyMutationInputObjectSchema } from './evidence_itemsUpdateManyMutationInput.schema';
import { evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersInput.schema'

export const evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_created_byTousersInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_created_byTousersInput, Prisma.evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_created_byTousersInput> = z.object({
  where: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateManyMutationInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersInputObjectSchema)])
}).strict();
export const evidence_itemsUpdateManyWithWhereWithoutUsers_evidence_items_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateManyMutationInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersInputObjectSchema)])
}).strict();
