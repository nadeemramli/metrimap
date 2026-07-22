// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesCreateWithoutProjectsInputObjectSchema } from './alert_rulesCreateWithoutProjectsInput.schema';
import { alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema } from './alert_rulesUncheckedCreateWithoutProjectsInput.schema';
import { alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema } from './alert_rulesCreateOrConnectWithoutProjectsInput.schema';
import { alert_rulesCreateManyProjectsInputEnvelopeObjectSchema } from './alert_rulesCreateManyProjectsInputEnvelope.schema';
import { alert_rulesWhereUniqueInputObjectSchema } from './alert_rulesWhereUniqueInput.schema'

export const alert_rulesUncheckedCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.alert_rulesUncheckedCreateNestedManyWithoutProjectsInput, Prisma.alert_rulesUncheckedCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => alert_rulesCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const alert_rulesUncheckedCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => alert_rulesCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
