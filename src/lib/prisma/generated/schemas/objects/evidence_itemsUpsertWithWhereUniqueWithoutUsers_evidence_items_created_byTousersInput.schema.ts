// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsUpdateWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsUncheckedUpdateWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsUncheckedUpdateWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInput.schema'

export const evidence_itemsUpsertWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpsertWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInput, Prisma.evidence_itemsUpsertWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutUsers_evidence_items_created_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema)])
}).strict();
export const evidence_itemsUpsertWithWhereUniqueWithoutUsers_evidence_items_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutUsers_evidence_items_created_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutUsers_evidence_items_created_byTousersInputObjectSchema)])
}).strict();
