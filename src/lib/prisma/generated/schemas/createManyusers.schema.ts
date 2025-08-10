import { z } from 'zod';
import { usersCreateManyInputObjectSchema } from './objects/usersCreateManyInput.schema'

export const usersCreateManySchema = z.object({ data: z.union([ usersCreateManyInputObjectSchema, z.array(usersCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() })