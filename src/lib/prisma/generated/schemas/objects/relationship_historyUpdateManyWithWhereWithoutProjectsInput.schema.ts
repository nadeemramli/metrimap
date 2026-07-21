// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyScalarWhereInputObjectSchema } from './relationship_historyScalarWhereInput.schema';
import { relationship_historyUpdateManyMutationInputObjectSchema } from './relationship_historyUpdateManyMutationInput.schema';
import { relationship_historyUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './relationship_historyUncheckedUpdateManyWithoutProjectsInput.schema'

export const relationship_historyUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationship_historyUpdateManyWithWhereWithoutProjectsInput, Prisma.relationship_historyUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => relationship_historyScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationship_historyUpdateManyMutationInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const relationship_historyUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_historyScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationship_historyUpdateManyMutationInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
