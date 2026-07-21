// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsCreateWithoutProjectsInputObjectSchema } from './evidence_itemsCreateWithoutProjectsInput.schema';
import { evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutProjectsInput.schema'

export const evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateOrConnectWithoutProjectsInput, Prisma.evidence_itemsCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const evidence_itemsCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
