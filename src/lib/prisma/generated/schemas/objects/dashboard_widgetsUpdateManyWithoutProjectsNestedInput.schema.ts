// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { dashboard_widgetsCreateWithoutProjectsInputObjectSchema } from './dashboard_widgetsCreateWithoutProjectsInput.schema';
import { dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema } from './dashboard_widgetsUncheckedCreateWithoutProjectsInput.schema';
import { dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema } from './dashboard_widgetsCreateOrConnectWithoutProjectsInput.schema';
import { dashboard_widgetsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './dashboard_widgetsUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { dashboard_widgetsCreateManyProjectsInputEnvelopeObjectSchema } from './dashboard_widgetsCreateManyProjectsInputEnvelope.schema';
import { dashboard_widgetsWhereUniqueInputObjectSchema } from './dashboard_widgetsWhereUniqueInput.schema';
import { dashboard_widgetsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './dashboard_widgetsUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { dashboard_widgetsUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './dashboard_widgetsUpdateManyWithWhereWithoutProjectsInput.schema';
import { dashboard_widgetsScalarWhereInputObjectSchema } from './dashboard_widgetsScalarWhereInput.schema'

export const dashboard_widgetsUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsUpdateManyWithoutProjectsNestedInput, Prisma.dashboard_widgetsUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => dashboard_widgetsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => dashboard_widgetsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema), z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema), z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema), z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema), z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => dashboard_widgetsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => dashboard_widgetsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema), z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const dashboard_widgetsUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => dashboard_widgetsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => dashboard_widgetsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema), z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema), z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema), z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema), z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => dashboard_widgetsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => dashboard_widgetsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema), z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
