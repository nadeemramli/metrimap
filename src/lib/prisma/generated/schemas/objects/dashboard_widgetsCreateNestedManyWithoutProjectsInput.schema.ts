// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { dashboard_widgetsCreateWithoutProjectsInputObjectSchema } from './dashboard_widgetsCreateWithoutProjectsInput.schema';
import { dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema } from './dashboard_widgetsUncheckedCreateWithoutProjectsInput.schema';
import { dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema } from './dashboard_widgetsCreateOrConnectWithoutProjectsInput.schema';
import { dashboard_widgetsCreateManyProjectsInputEnvelopeObjectSchema } from './dashboard_widgetsCreateManyProjectsInputEnvelope.schema';
import { dashboard_widgetsWhereUniqueInputObjectSchema } from './dashboard_widgetsWhereUniqueInput.schema'

export const dashboard_widgetsCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsCreateNestedManyWithoutProjectsInput, Prisma.dashboard_widgetsCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => dashboard_widgetsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema), z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const dashboard_widgetsCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => dashboard_widgetsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema), z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
