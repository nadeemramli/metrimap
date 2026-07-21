// @ts-nocheck
import { z } from 'zod';
import { alert_rulesSelectObjectSchema } from './objects/alert_rulesSelect.schema.js';
import { alert_rulesIncludeObjectSchema } from './objects/alert_rulesInclude.schema.js';
import { alert_rulesUpdateInputObjectSchema } from './objects/alert_rulesUpdateInput.schema';
import { alert_rulesUncheckedUpdateInputObjectSchema } from './objects/alert_rulesUncheckedUpdateInput.schema';
import { alert_rulesWhereUniqueInputObjectSchema } from './objects/alert_rulesWhereUniqueInput.schema'

export const alert_rulesUpdateOneSchema = z.object({ select: alert_rulesSelectObjectSchema.optional(), include: alert_rulesIncludeObjectSchema.optional(), data: z.union([alert_rulesUpdateInputObjectSchema, alert_rulesUncheckedUpdateInputObjectSchema]), where: alert_rulesWhereUniqueInputObjectSchema  })