// @ts-nocheck
import { z } from 'zod';
import { alert_rulesWhereInputObjectSchema } from './objects/alert_rulesWhereInput.schema'

export const alert_rulesDeleteManySchema = z.object({ where: alert_rulesWhereInputObjectSchema.optional()  })