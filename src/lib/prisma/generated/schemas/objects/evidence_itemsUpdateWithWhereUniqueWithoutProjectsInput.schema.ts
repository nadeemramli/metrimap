// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithoutProjectsInputObjectSchema } from './evidence_itemsUpdateWithoutProjectsInput.schema';
import { evidence_itemsUncheckedUpdateWithoutProjectsInputObjectSchema } from './evidence_itemsUncheckedUpdateWithoutProjectsInput.schema'

export const evidence_itemsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpdateWithWhereUniqueWithoutProjectsInput, Prisma.evidence_itemsUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const evidence_itemsUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
