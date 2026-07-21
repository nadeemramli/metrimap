// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateWithoutProjectsInputObjectSchema } from './tagsCreateWithoutProjectsInput.schema';
import { tagsUncheckedCreateWithoutProjectsInputObjectSchema } from './tagsUncheckedCreateWithoutProjectsInput.schema';
import { tagsCreateOrConnectWithoutProjectsInputObjectSchema } from './tagsCreateOrConnectWithoutProjectsInput.schema';
import { tagsCreateManyProjectsInputEnvelopeObjectSchema } from './tagsCreateManyProjectsInputEnvelope.schema';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema'

export const tagsCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.tagsCreateNestedManyWithoutProjectsInput, Prisma.tagsCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tagsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => tagsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tagsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const tagsCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tagsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => tagsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tagsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
