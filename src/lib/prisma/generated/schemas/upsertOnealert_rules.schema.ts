// @ts-nocheck
import { z } from 'zod';
import { alert_rulesSelectObjectSchema } from './objects/alert_rulesSelect.schema.js';
import { alert_rulesIncludeObjectSchema } from './objects/alert_rulesInclude.schema.js';
import { alert_rulesWhereUniqueInputObjectSchema } from './objects/alert_rulesWhereUniqueInput.schema';
import { alert_rulesCreateInputObjectSchema } from './objects/alert_rulesCreateInput.schema';
import { alert_rulesUncheckedCreateInputObjectSchema } from './objects/alert_rulesUncheckedCreateInput.schema';
import { alert_rulesUpdateInputObjectSchema } from './objects/alert_rulesUpdateInput.schema';
import { alert_rulesUncheckedUpdateInputObjectSchema } from './objects/alert_rulesUncheckedUpdateInput.schema'

export const alert_rulesUpsertSchema = z.object({ select: alert_rulesSelectObjectSchema.optional(), include: alert_rulesIncludeObjectSchema.optional(), where: alert_rulesWhereUniqueInputObjectSchema, create: z.union([ alert_rulesCreateInputObjectSchema, alert_rulesUncheckedCreateInputObjectSchema ]), update: z.union([ alert_rulesUpdateInputObjectSchema, alert_rulesUncheckedUpdateInputObjectSchema ])  })