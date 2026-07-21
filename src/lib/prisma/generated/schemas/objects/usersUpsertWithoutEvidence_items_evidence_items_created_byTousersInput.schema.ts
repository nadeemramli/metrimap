// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersCreateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const usersUpsertWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersUpsertWithoutEvidence_items_evidence_items_created_byTousersInput, Prisma.usersUpsertWithoutEvidence_items_evidence_items_created_byTousersInput> = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const usersUpsertWithoutEvidence_items_evidence_items_created_byTousersInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
