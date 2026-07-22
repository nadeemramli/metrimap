// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsScalarWhereInputObjectSchema } from './evidence_itemsScalarWhereInput.schema';
import { evidence_itemsUpdateManyMutationInputObjectSchema } from './evidence_itemsUpdateManyMutationInput.schema';
import { evidence_itemsUncheckedUpdateManyWithoutRelationshipsInputObjectSchema } from './evidence_itemsUncheckedUpdateManyWithoutRelationshipsInput.schema'

export const evidence_itemsUpdateManyWithWhereWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpdateManyWithWhereWithoutRelationshipsInput, Prisma.evidence_itemsUpdateManyWithWhereWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateManyMutationInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutRelationshipsInputObjectSchema)])
}).strict();
export const evidence_itemsUpdateManyWithWhereWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateManyMutationInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutRelationshipsInputObjectSchema)])
}).strict();
