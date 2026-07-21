// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyWhereUniqueInputObjectSchema } from './relationship_historyWhereUniqueInput.schema';
import { relationship_historyUpdateWithoutRelationshipsInputObjectSchema } from './relationship_historyUpdateWithoutRelationshipsInput.schema';
import { relationship_historyUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './relationship_historyUncheckedUpdateWithoutRelationshipsInput.schema'

export const relationship_historyUpdateWithWhereUniqueWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_historyUpdateWithWhereUniqueWithoutRelationshipsInput, Prisma.relationship_historyUpdateWithWhereUniqueWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationship_historyUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const relationship_historyUpdateWithWhereUniqueWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationship_historyUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateWithoutRelationshipsInputObjectSchema)])
}).strict();
