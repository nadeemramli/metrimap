// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyScalarWhereInputObjectSchema } from './relationship_historyScalarWhereInput.schema';
import { relationship_historyUpdateManyMutationInputObjectSchema } from './relationship_historyUpdateManyMutationInput.schema';
import { relationship_historyUncheckedUpdateManyWithoutRelationshipsInputObjectSchema } from './relationship_historyUncheckedUpdateManyWithoutRelationshipsInput.schema'

export const relationship_historyUpdateManyWithWhereWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_historyUpdateManyWithWhereWithoutRelationshipsInput, Prisma.relationship_historyUpdateManyWithWhereWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => relationship_historyScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationship_historyUpdateManyMutationInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateManyWithoutRelationshipsInputObjectSchema)])
}).strict();
export const relationship_historyUpdateManyWithWhereWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_historyScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationship_historyUpdateManyMutationInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateManyWithoutRelationshipsInputObjectSchema)])
}).strict();
