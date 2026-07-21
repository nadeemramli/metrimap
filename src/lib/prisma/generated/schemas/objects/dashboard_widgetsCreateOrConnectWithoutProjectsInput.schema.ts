// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { dashboard_widgetsWhereUniqueInputObjectSchema } from './dashboard_widgetsWhereUniqueInput.schema';
import { dashboard_widgetsCreateWithoutProjectsInputObjectSchema } from './dashboard_widgetsCreateWithoutProjectsInput.schema';
import { dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema } from './dashboard_widgetsUncheckedCreateWithoutProjectsInput.schema'

export const dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsCreateOrConnectWithoutProjectsInput, Prisma.dashboard_widgetsCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const dashboard_widgetsCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
