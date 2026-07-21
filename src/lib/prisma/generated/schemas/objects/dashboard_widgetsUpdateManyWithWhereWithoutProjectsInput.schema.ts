// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { dashboard_widgetsScalarWhereInputObjectSchema } from './dashboard_widgetsScalarWhereInput.schema';
import { dashboard_widgetsUpdateManyMutationInputObjectSchema } from './dashboard_widgetsUpdateManyMutationInput.schema';
import { dashboard_widgetsUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './dashboard_widgetsUncheckedUpdateManyWithoutProjectsInput.schema'

export const dashboard_widgetsUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsUpdateManyWithWhereWithoutProjectsInput, Prisma.dashboard_widgetsUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => dashboard_widgetsUpdateManyMutationInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const dashboard_widgetsUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => dashboard_widgetsUpdateManyMutationInputObjectSchema), z.lazy(() => dashboard_widgetsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
