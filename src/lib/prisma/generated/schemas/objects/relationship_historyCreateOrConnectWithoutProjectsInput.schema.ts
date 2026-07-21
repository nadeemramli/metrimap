// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyWhereUniqueInputObjectSchema } from './relationship_historyWhereUniqueInput.schema';
import { relationship_historyCreateWithoutProjectsInputObjectSchema } from './relationship_historyCreateWithoutProjectsInput.schema';
import { relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema } from './relationship_historyUncheckedCreateWithoutProjectsInput.schema'

export const relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationship_historyCreateOrConnectWithoutProjectsInput, Prisma.relationship_historyCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const relationship_historyCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
