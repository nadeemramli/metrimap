// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogCreateWithoutProjectsInputObjectSchema } from './changelogCreateWithoutProjectsInput.schema';
import { changelogUncheckedCreateWithoutProjectsInputObjectSchema } from './changelogUncheckedCreateWithoutProjectsInput.schema';
import { changelogCreateOrConnectWithoutProjectsInputObjectSchema } from './changelogCreateOrConnectWithoutProjectsInput.schema';
import { changelogCreateManyProjectsInputEnvelopeObjectSchema } from './changelogCreateManyProjectsInputEnvelope.schema';
import { changelogWhereUniqueInputObjectSchema } from './changelogWhereUniqueInput.schema'

export const changelogCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.changelogCreateNestedManyWithoutProjectsInput, Prisma.changelogCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => changelogCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => changelogCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => changelogCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const changelogCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => changelogCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => changelogCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => changelogCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
