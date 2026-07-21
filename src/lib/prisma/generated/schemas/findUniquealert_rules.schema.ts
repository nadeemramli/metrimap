// @ts-nocheck
import { z } from 'zod';
import { alert_rulesSelectObjectSchema } from './objects/alert_rulesSelect.schema.js';
import { alert_rulesIncludeObjectSchema } from './objects/alert_rulesInclude.schema.js';
import { alert_rulesWhereUniqueInputObjectSchema } from './objects/alert_rulesWhereUniqueInput.schema'

export const alert_rulesFindUniqueSchema = z.object({ select: alert_rulesSelectObjectSchema.optional(), include: alert_rulesIncludeObjectSchema.optional(), where: alert_rulesWhereUniqueInputObjectSchema })