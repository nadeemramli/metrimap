// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInput.schema'

export const usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_created_byTousersInput, Prisma.usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_created_byTousersInput> = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)])
}).strict();
export const usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)])
}).strict();
