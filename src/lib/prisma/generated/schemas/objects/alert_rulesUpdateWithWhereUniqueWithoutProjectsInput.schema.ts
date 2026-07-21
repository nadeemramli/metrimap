// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesWhereUniqueInputObjectSchema } from './alert_rulesWhereUniqueInput.schema';
import { alert_rulesUpdateWithoutProjectsInputObjectSchema } from './alert_rulesUpdateWithoutProjectsInput.schema';
import { alert_rulesUncheckedUpdateWithoutProjectsInputObjectSchema } from './alert_rulesUncheckedUpdateWithoutProjectsInput.schema'

export const alert_rulesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.alert_rulesUpdateWithWhereUniqueWithoutProjectsInput, Prisma.alert_rulesUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => alert_rulesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const alert_rulesUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => alert_rulesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
