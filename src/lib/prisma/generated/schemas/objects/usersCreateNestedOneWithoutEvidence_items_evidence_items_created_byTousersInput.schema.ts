// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersCreateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInput, Prisma.usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutEvidence_items_evidence_items_created_byTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
