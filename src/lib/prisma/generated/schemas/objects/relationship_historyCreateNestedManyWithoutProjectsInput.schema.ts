// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyCreateWithoutProjectsInputObjectSchema } from './relationship_historyCreateWithoutProjectsInput.schema';
import { relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema } from './relationship_historyUncheckedCreateWithoutProjectsInput.schema';
import { relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema } from './relationship_historyCreateOrConnectWithoutProjectsInput.schema';
import { relationship_historyCreateManyProjectsInputEnvelopeObjectSchema } from './relationship_historyCreateManyProjectsInputEnvelope.schema';
import { relationship_historyWhereUniqueInputObjectSchema } from './relationship_historyWhereUniqueInput.schema'

export const relationship_historyCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationship_historyCreateNestedManyWithoutProjectsInput, Prisma.relationship_historyCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_historyCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const relationship_historyCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_historyCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
