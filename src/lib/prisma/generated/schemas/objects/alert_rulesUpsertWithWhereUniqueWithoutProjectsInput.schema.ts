// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesWhereUniqueInputObjectSchema } from './alert_rulesWhereUniqueInput.schema';
import { alert_rulesUpdateWithoutProjectsInputObjectSchema } from './alert_rulesUpdateWithoutProjectsInput.schema';
import { alert_rulesUncheckedUpdateWithoutProjectsInputObjectSchema } from './alert_rulesUncheckedUpdateWithoutProjectsInput.schema';
import { alert_rulesCreateWithoutProjectsInputObjectSchema } from './alert_rulesCreateWithoutProjectsInput.schema';
import { alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema } from './alert_rulesUncheckedCreateWithoutProjectsInput.schema'

export const alert_rulesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.alert_rulesUpsertWithWhereUniqueWithoutProjectsInput, Prisma.alert_rulesUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => alert_rulesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const alert_rulesUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => alert_rulesUpdateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
