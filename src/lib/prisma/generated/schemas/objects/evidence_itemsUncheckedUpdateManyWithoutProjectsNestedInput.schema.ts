// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateWithoutProjectsInputObjectSchema } from './evidence_itemsCreateWithoutProjectsInput.schema';
import { evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutProjectsInput.schema';
import { evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema } from './evidence_itemsCreateOrConnectWithoutProjectsInput.schema';
import { evidence_itemsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './evidence_itemsUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { evidence_itemsCreateManyProjectsInputEnvelopeObjectSchema } from './evidence_itemsCreateManyProjectsInputEnvelope.schema';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './evidence_itemsUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { evidence_itemsUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './evidence_itemsUpdateManyWithWhereWithoutProjectsInput.schema';
import { evidence_itemsScalarWhereInputObjectSchema } from './evidence_itemsScalarWhereInput.schema'

export const evidence_itemsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.evidence_itemsUncheckedUpdateManyWithoutProjectsNestedInput, Prisma.evidence_itemsUncheckedUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const evidence_itemsUncheckedUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
