// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithoutRelationshipsInputObjectSchema } from './evidence_itemsUpdateWithoutRelationshipsInput.schema';
import { evidence_itemsUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './evidence_itemsUncheckedUpdateWithoutRelationshipsInput.schema'

export const evidence_itemsUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpdateWithWhereUniqueWithoutRelationshipsInput, Prisma.evidence_itemsUpdateWithWhereUniqueWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const evidence_itemsUpdateWithWhereUniqueWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutRelationshipsInputObjectSchema)])
}).strict();
