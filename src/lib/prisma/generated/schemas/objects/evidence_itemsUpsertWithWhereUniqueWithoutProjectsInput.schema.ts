// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithoutProjectsInputObjectSchema } from './evidence_itemsUpdateWithoutProjectsInput.schema';
import { evidence_itemsUncheckedUpdateWithoutProjectsInputObjectSchema } from './evidence_itemsUncheckedUpdateWithoutProjectsInput.schema';
import { evidence_itemsCreateWithoutProjectsInputObjectSchema } from './evidence_itemsCreateWithoutProjectsInput.schema';
import { evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutProjectsInput.schema'

export const evidence_itemsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpsertWithWhereUniqueWithoutProjectsInput, Prisma.evidence_itemsUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const evidence_itemsUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
