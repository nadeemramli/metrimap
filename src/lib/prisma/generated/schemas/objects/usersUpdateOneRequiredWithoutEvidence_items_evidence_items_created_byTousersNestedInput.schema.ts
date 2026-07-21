// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersCreateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersUpsertWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUpsertWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInput.schema'

export const usersUpdateOneRequiredWithoutEvidence_items_evidence_items_created_byTousersNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneRequiredWithoutEvidence_items_evidence_items_created_byTousersNestedInput, Prisma.usersUpdateOneRequiredWithoutEvidence_items_evidence_items_created_byTousersNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneRequiredWithoutEvidence_items_evidence_items_created_byTousersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)]).optional()
}).strict();
