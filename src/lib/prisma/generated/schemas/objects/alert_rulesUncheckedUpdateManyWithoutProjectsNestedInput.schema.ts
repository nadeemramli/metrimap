// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesCreateWithoutProjectsInputObjectSchema } from './alert_rulesCreateWithoutProjectsInput.schema';
import { alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema } from './alert_rulesUncheckedCreateWithoutProjectsInput.schema';
import { alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema } from './alert_rulesCreateOrConnectWithoutProjectsInput.schema';
import { alert_rulesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './alert_rulesUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { alert_rulesCreateManyProjectsInputEnvelopeObjectSchema } from './alert_rulesCreateManyProjectsInputEnvelope.schema';
import { alert_rulesWhereUniqueInputObjectSchema } from './alert_rulesWhereUniqueInput.schema';
import { alert_rulesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './alert_rulesUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { alert_rulesUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './alert_rulesUpdateManyWithWhereWithoutProjectsInput.schema';
import { alert_rulesScalarWhereInputObjectSchema } from './alert_rulesScalarWhereInput.schema'

export const alert_rulesUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.alert_rulesUncheckedUpdateManyWithoutProjectsNestedInput, Prisma.alert_rulesUncheckedUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => alert_rulesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => alert_rulesCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => alert_rulesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => alert_rulesUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => alert_rulesScalarWhereInputObjectSchema), z.lazy(() => alert_rulesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const alert_rulesUncheckedUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => alert_rulesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => alert_rulesCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => alert_rulesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => alert_rulesUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => alert_rulesScalarWhereInputObjectSchema), z.lazy(() => alert_rulesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
