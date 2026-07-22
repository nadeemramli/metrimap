// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema'

export const usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema: z.ZodType<Prisma.usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_owner_idTousersInput, Prisma.usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_owner_idTousersInput> = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)])
}).strict();
export const usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_owner_idTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)])
}).strict();
