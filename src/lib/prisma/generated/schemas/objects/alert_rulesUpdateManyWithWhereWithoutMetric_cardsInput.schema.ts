// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesScalarWhereInputObjectSchema } from './alert_rulesScalarWhereInput.schema';
import { alert_rulesUpdateManyMutationInputObjectSchema } from './alert_rulesUpdateManyMutationInput.schema';
import { alert_rulesUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema } from './alert_rulesUncheckedUpdateManyWithoutMetric_cardsInput.schema'

export const alert_rulesUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.alert_rulesUpdateManyWithWhereWithoutMetric_cardsInput, Prisma.alert_rulesUpdateManyWithWhereWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => alert_rulesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => alert_rulesUpdateManyMutationInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const alert_rulesUpdateManyWithWhereWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => alert_rulesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => alert_rulesUpdateManyMutationInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema)])
}).strict();
