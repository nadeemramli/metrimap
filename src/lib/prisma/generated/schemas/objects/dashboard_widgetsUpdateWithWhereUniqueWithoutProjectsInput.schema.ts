// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { dashboard_widgetsWhereUniqueInputObjectSchema } from './dashboard_widgetsWhereUniqueInput.schema';
import { dashboard_widgetsUpdateWithoutProjectsInputObjectSchema } from './dashboard_widgetsUpdateWithoutProjectsInput.schema';
import { dashboard_widgetsUncheckedUpdateWithoutProjectsInputObjectSchema } from './dashboard_widgetsUncheckedUpdateWithoutProjectsInput.schema'

export const dashboard_widgetsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsUpdateWithWhereUniqueWithoutProjectsInput, Prisma.dashboard_widgetsUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => dashboard_widgetsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const dashboard_widgetsUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => dashboard_widgetsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => dashboard_widgetsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
