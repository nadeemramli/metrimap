// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { dashboard_widgetsWhereUniqueInputObjectSchema } from './dashboard_widgetsWhereUniqueInput.schema';
import { dashboard_widgetsUpdateWithoutProjectsInputObjectSchema } from './dashboard_widgetsUpdateWithoutProjectsInput.schema';
import { dashboard_widgetsUncheckedUpdateWithoutProjectsInputObjectSchema } from './dashboard_widgetsUncheckedUpdateWithoutProjectsInput.schema';
import { dashboard_widgetsCreateWithoutProjectsInputObjectSchema } from './dashboard_widgetsCreateWithoutProjectsInput.schema';
import { dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema } from './dashboard_widgetsUncheckedCreateWithoutProjectsInput.schema'

export const dashboard_widgetsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsUpsertWithWhereUniqueWithoutProjectsInput, Prisma.dashboard_widgetsUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => dashboard_widgetsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const dashboard_widgetsUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => dashboard_widgetsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => dashboard_widgetsCreateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
