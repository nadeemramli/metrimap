// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsScalarWhereInputObjectSchema } from './evidence_itemsScalarWhereInput.schema';
import { evidence_itemsUpdateManyMutationInputObjectSchema } from './evidence_itemsUpdateManyMutationInput.schema';
import { evidence_itemsUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './evidence_itemsUncheckedUpdateManyWithoutProjectsInput.schema'

export const evidence_itemsUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpdateManyWithWhereWithoutProjectsInput, Prisma.evidence_itemsUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateManyMutationInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const evidence_itemsUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateManyMutationInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
