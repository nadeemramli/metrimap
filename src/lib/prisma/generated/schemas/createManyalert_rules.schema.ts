// @ts-nocheck
import { z } from 'zod';
import { alert_rulesCreateManyInputObjectSchema } from './objects/alert_rulesCreateManyInput.schema'

export const alert_rulesCreateManySchema = z.object({ data: z.union([ alert_rulesCreateManyInputObjectSchema, z.array(alert_rulesCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() })