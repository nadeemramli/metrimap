// @ts-nocheck
import { z } from 'zod';
import { alert_rulesSelectObjectSchema } from './objects/alert_rulesSelect.schema.js';
import { alert_rulesIncludeObjectSchema } from './objects/alert_rulesInclude.schema.js';
import { alert_rulesCreateInputObjectSchema } from './objects/alert_rulesCreateInput.schema';
import { alert_rulesUncheckedCreateInputObjectSchema } from './objects/alert_rulesUncheckedCreateInput.schema'

export const alert_rulesCreateOneSchema = z.object({ select: alert_rulesSelectObjectSchema.optional(), include: alert_rulesIncludeObjectSchema.optional(), data: z.union([alert_rulesCreateInputObjectSchema, alert_rulesUncheckedCreateInputObjectSchema])  })