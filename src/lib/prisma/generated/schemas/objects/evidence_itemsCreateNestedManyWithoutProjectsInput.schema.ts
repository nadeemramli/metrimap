// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateWithoutProjectsInputObjectSchema } from './evidence_itemsCreateWithoutProjectsInput.schema';
import { evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutProjectsInput.schema';
import { evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema } from './evidence_itemsCreateOrConnectWithoutProjectsInput.schema';
import { evidence_itemsCreateManyProjectsInputEnvelopeObjectSchema } from './evidence_itemsCreateManyProjectsInputEnvelope.schema';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema'

export const evidence_itemsCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateNestedManyWithoutProjectsInput, Prisma.evidence_itemsCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const evidence_itemsCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
