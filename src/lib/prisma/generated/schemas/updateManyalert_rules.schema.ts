// @ts-nocheck
import { z } from 'zod';
import { alert_rulesUpdateManyMutationInputObjectSchema } from './objects/alert_rulesUpdateManyMutationInput.schema';
import { alert_rulesWhereInputObjectSchema } from './objects/alert_rulesWhereInput.schema'

export const alert_rulesUpdateManySchema = z.object({ data: alert_rulesUpdateManyMutationInputObjectSchema, where: alert_rulesWhereInputObjectSchema.optional()  })